import { BaseQueryApi } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { Mutex } from "async-mutex";
import { StatusCodes } from "http-status-codes";
import { FAILED_TOKEN_REFRESH } from "../../constants";
import { AuthenticationData } from "../../types/auth";
import {
  updateCurrentUser,
  selectCurrentUserTokens,
} from "../slices/current-user-slice";
import type { RootState } from "../store";

// Conditionally add authorization header to request
// Reference: https://redux-toolkit.js.org/rtk-query/api/fetchBaseQuery#setting-default-headers-on-requests

type ExtraOptions = { includeAuth?: boolean };

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  // add auth header if required
  prepareHeaders: (headers, { getState, extra }) => {
    const { includeAuth } = (extra as ExtraOptions | undefined) ?? {};

    if (!includeAuth) {
      return headers;
    }

    const { access } = selectCurrentUserTokens(getState() as RootState) ?? {};

    if (!access) {
      console.error("Failed to include auth header, access token:", access);
      return headers;
    }

    headers.set("authorization", `Bearer ${access}`);

    return headers;
  },
});

// Implement query with token refresh
// Reference: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#automatic-re-authorization-by-extending-fetchbasequery
// Reference: https://redux-toolkit.js.org/rtk-query/usage/customizing-queries#preventing-multiple-unauthorized-errors

// This mutex is used to indicate if token refresh is in-progress
// States:
// locked: token refresh in progress
// unlocked: token refresh NOT in progress
// This prevents multiple calls to token refresh
const mutex = new Mutex();

// returns true if successful else false
async function tokenRefresh(api: BaseQueryApi) {
  const release = await mutex.acquire();

  try {
    // refresh token
    const { refresh } =
      selectCurrentUserTokens(api.getState() as RootState) ?? {};

    const result = await baseQuery(
      {
        url: "/gateway/refresh/",
        method: "POST",
        body: { refresh },
      },
      api,
      {},
    );

    console.log("Token refresh result:", result);

    if (result.error !== undefined) {
      return false;
    }

    api.dispatch(updateCurrentUser(result.data as AuthenticationData));

    return true;
  } catch (error) {
    console.error("Unexpected error during token refresh:", error);
    return false;
  } finally {
    // signal end of token refresh
    release();
  }
}

function isForbiddenOrNotAuthenticated(error?: FetchBaseQueryError) {
  return [StatusCodes.UNAUTHORIZED, StatusCodes.FORBIDDEN].some(
    (statusCode) => error?.status === statusCode,
  );
}

const baseQueryWithTokenRefresh: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  ExtraOptions,
  FetchBaseQueryMeta
> = async (args, api, extraOptions = { includeAuth: true }) => {
  // wait for token refresh to complete if any, does not lock mutex
  await mutex.waitForUnlock();

  console.log("Start api call:", args, api, extraOptions);

  // NOTE: rtk-query bug (extra options is not accessed at all in baseQuery)
  // current fix is to manually merge extraOptions to api.extra
  const queryApi = { ...api, extra: extraOptions };

  const result = await baseQuery(args, queryApi, extraOptions);

  console.log("Api call result:", result);

  const { includeAuth } = extraOptions;

  // return immediately if neither
  if (!includeAuth || !isForbiddenOrNotAuthenticated(result.error)) {
    return result;
  }

  // check whether token refresh is in progress
  if (mutex.isLocked()) {
    // wait until token refresh is completed, does not lock mutex
    await mutex.waitForUnlock();
  } else {
    // proceed to refresh token
    const hasRefreshedToken = await tokenRefresh(api);

    if (!hasRefreshedToken) {
      console.warn(FAILED_TOKEN_REFRESH);
      // update error
      result.error = {
        status: "CUSTOM_ERROR",
        data: {
          detail: "Your current session has expired. Please log in again.",
        },
        error: FAILED_TOKEN_REFRESH,
      };

      return result;
    }
  }

  // retry request with refreshed tokens
  const newResult = await baseQuery(args, queryApi, extraOptions);

  console.log("Post token refresh api call result:", newResult);

  return newResult;
};

// Set up for code splitting
// Reference: https://redux-toolkit.js.org/rtk-query/usage/code-splitting
const baseApi = createApi({
  baseQuery: baseQueryWithTokenRefresh,
  keepUnusedDataFor: 30,
  refetchOnReconnect: true,
  refetchOnMountOrArgChange: 30,
  endpoints: () => ({}),
});

export default baseApi;

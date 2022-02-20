import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react";
import { StatusCodes } from "http-status-codes";
import { AuthenticationData } from "../../types/auth";
import { updateCurrentUser } from "../slices/current-user-slice";
import loggedOut from "../thunks/logged-out";

function isForbiddenOrNotAuthenticated(error?: FetchBaseQueryError) {
  return [StatusCodes.UNAUTHORIZED, StatusCodes.FORBIDDEN].some(
    (statusCode) => error?.status === statusCode,
  );
}

const baseQuery = fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL });

const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (isForbiddenOrNotAuthenticated(result.error)) {
    // try to get a new token
    const refreshResult = await baseQuery(
      {
        url: "/gateway/refresh",
        method: "POST",
        body: {},
      },
      api,
      extraOptions,
    );

    if (refreshResult.error) {
    }

    if (refreshResult.data) {
      // store the new token
      api.dispatch(updateCurrentUser(refreshResult.data as AuthenticationData));
      // retry the initial query
      result = await baseQuery(args, api, extraOptions);
    } else {
      api.dispatch(loggedOut());
    }
  }

  return result;
};

const baseApi = createApi({
  baseQuery: baseQuery,
  endpoints: () => ({}),
});

export default baseApi;

import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
  EndpointDefinitions,
  EndpointDefinition,
} from "@reduxjs/toolkit/query/react";
import { StatusCodes } from "http-status-codes";
import { AuthenticationData } from "../../types/auth";
import { updateCurrentUser } from "../slices/current-user-slice";
import resetAppState from "../thunks/reset-app-state";

function isForbiddenOrNotAuthenticated(error?: FetchBaseQueryError) {
  return [StatusCodes.UNAUTHORIZED, StatusCodes.FORBIDDEN].some(
    (statusCode) => error?.status === statusCode,
  );
}

const baseQuery = fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_URL });

type MyQueryType = BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError,
  { includeAuth?: boolean },
  FetchBaseQueryMeta
>;

const myQuery: MyQueryType = async (
  args,
  api,
  extraOptions = { includeAuth: true },
) => {
  console.log("Start api call:", args);
  const result = await baseQuery(args, api, extraOptions);

  // if (isForbiddenOrNotAuthenticated(result.error)) {
  //   // try to get a new token
  //   const refreshResult = await baseQuery(
  //     {
  //       url: "/gateway/refresh",
  //       method: "POST",
  //       body: {},
  //     },
  //     api,
  //     extraOptions,
  //   );

  //   if (refreshResult.error) {
  //   }

  //   if (refreshResult.data) {
  //     // store the new token
  //     api.dispatch(updateCurrentUser(refreshResult.data as AuthenticationData));
  //     // retry the initial query
  //     result = await baseQuery(args, api, extraOptions);
  //   } else {
  //     api.dispatch(resetAppState());
  //   }
  // }

  console.log("Api call result:", result);
  return result;
};

const baseApi = createApi({
  baseQuery: myQuery,
  endpoints: () => ({}),
});

export default baseApi;

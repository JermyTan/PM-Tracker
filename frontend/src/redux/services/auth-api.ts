import baseApi from "./base-api";
import {
  AuthenticationData,
  AccountDetails,
  PasswordLoginPostData,
  CheckAccountPostData,
} from "../../types/auth";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    checkAccount: builder.query<AccountDetails, CheckAccountPostData>({
      query: (data) => ({
        url: "/gateway/check/",
        method: "POST",
        body: data,
      }),
    }),
    passwordLogin: builder.mutation<AuthenticationData, PasswordLoginPostData>({
      query: (data) => ({
        url: "/gateway/login/",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { usePasswordLoginMutation, useLazyCheckAccountQuery } = authApi;

export default authApi;

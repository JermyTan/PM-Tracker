import baseApi from "./base-api";
import {
  AuthenticationData,
  AccountDetails,
  PasswordLoginPostData,
  CheckAccountPostData,
} from "../../types/auth";

const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    checkAccount: build.query<AccountDetails, CheckAccountPostData>({
      query: (data) => ({
        url: "/gateway/check/",
        method: "POST",
        body: data,
      }),
      extraOptions: { includeAuth: false },
    }),
    passwordLogin: build.mutation<AuthenticationData, PasswordLoginPostData>({
      query: (data) => ({
        url: "/gateway/login/",
        method: "POST",
        body: data,
      }),
      extraOptions: { includeAuth: false },
    }),
  }),
});

export const { usePasswordLoginMutation, useLazyCheckAccountQuery } = authApi;

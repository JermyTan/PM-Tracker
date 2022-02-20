import baseApi from "./base-api";
import { AuthenticationData, PasswordLoginPostData } from "../../types/auth";

const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    passwordLogin: builder.mutation<AuthenticationData, PasswordLoginPostData>({
      query: (data) => ({
        url: "/gateway/login",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const { usePasswordLoginMutation } = authApi;

export default authApi;

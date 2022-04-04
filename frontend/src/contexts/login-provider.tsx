import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from "react";

import { AccountDetails } from "../types/auth";

type LoginContextType = {
  inputEmail: string;
  setInputEmail: Dispatch<SetStateAction<string>>;
  accountDetails?: AccountDetails;
  setAccountDetails: Dispatch<SetStateAction<AccountDetails | undefined>>;
};

export const LoginContext = createContext<LoginContextType>({
  inputEmail: "",
  setInputEmail: () => {
    throw new Error("setInputEmail not defined.");
  },
  setAccountDetails: () => {
    throw new Error("setAccountDetails not defined.");
  },
});

type Props = {
  children: ReactNode;
};

function LoginProvider({ children }: Props) {
  const [inputEmail, setInputEmail] = useState("");
  const [accountDetails, setAccountDetails] = useState<AccountDetails>();

  const contextValue = useMemo(
    () => ({
      inputEmail,
      setInputEmail,
      accountDetails,
      setAccountDetails,
    }),
    [inputEmail, accountDetails],
  );

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
}

export default LoginProvider;

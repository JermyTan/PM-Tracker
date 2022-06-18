import { ReactNode } from "react";
import { useAppSelector } from "../redux/hooks";
import { AccountType } from "../types/users";

type Props = {
  children: ReactNode;
  allowedAccountTypes: AccountType[];
  fallback?: ReactNode;
};

function AccountTypeRestrictedWrapper({
  children,
  allowedAccountTypes,
  fallback = null,
}: Props) {
  const accountType = useAppSelector(
    ({ currentUser }) => currentUser?.user?.accountType,
  );

  return (
    <>
      {accountType && allowedAccountTypes.includes(accountType)
        ? children
        : fallback}
    </>
  );
}

export default AccountTypeRestrictedWrapper;

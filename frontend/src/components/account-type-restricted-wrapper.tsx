import { ReactNode } from "react";
import { useDeepEqualAppSelector } from "../redux/hooks";
import { selectCurrentUserDisplayInfo } from "../redux/slices/current-user-slice";
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
  const { accountType } =
    useDeepEqualAppSelector(selectCurrentUserDisplayInfo) ?? {};

  return (
    <>
      {accountType && allowedAccountTypes.includes(accountType)
        ? children
        : fallback}
    </>
  );
}

export default AccountTypeRestrictedWrapper;

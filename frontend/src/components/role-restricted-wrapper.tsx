import { ReactNode } from "react";
import useGetCurrentUserRole from "../custom-hooks/use-get-current-user-role";
import { Role } from "../types/courses";

type Props = {
  children: ReactNode;
  allowedRoles?: Role[];
  allow?: boolean;
  fallback?: ReactNode;
};

function RoleRestrictedWrapper({
  children,
  allowedRoles,
  allow,
  fallback = null,
}: Props) {
  const role = useGetCurrentUserRole();

  return (
    <>{role && (allow || allowedRoles?.includes(role)) ? children : fallback}</>
  );
}

export default RoleRestrictedWrapper;

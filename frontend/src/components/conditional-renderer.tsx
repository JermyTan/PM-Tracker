import { ReactNode } from "react";

type Props<T> = {
  children: ReactNode;
  allow?: boolean;
  fallback?: ReactNode;
  permissionGetter?: { fn: () => Record<string, boolean>; key: string };
  permissionList?: { fn: () => T; allowed: T[] };
};

function ConditionalRenderer<T>({
  children,
  allow,
  fallback = null,
  permissionGetter,
  permissionList,
}: Props<T>) {
  const attribute = permissionList?.fn();
  const permissions = permissionGetter?.fn();
  const hasPermission =
    (attribute !== undefined && permissionList?.allowed.includes(attribute)) ||
    (permissionGetter && permissions?.[permissionGetter.key]);

  return <>{allow || hasPermission ? children : fallback}</>;
}

export default ConditionalRenderer;

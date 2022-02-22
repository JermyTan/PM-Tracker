import { useRouter } from "next/router";
import { ReactNode, useEffect } from "react";
import { useAppSelector } from "../redux/hooks";
import { selectIsLoggedIn } from "../redux/slices/current-user-slice";
import PlaceholderWrapper from "../components/placeholder-wrapper";
import { ALL_ROUTES, DASHBOARD_PATH, HOME_PATH } from "./paths";
import LoginPage from "../pages";

type Props = {
  children: ReactNode;
};

function RouteHandler({ children }: Props) {
  const isLoggedIn = useAppSelector(selectIsLoggedIn);
  const router = useRouter();

  useEffect(() => {
    // direct user to dashboard page if user has already logged in
    if (isLoggedIn && router.pathname === HOME_PATH) {
      router.push(DASHBOARD_PATH);
    }
  }, [isLoggedIn, router]);

  // isFallback only matters if SSR is enabled
  // reference: https://nextjs.org/docs/api-reference/data-fetching/get-static-paths#fallback-pages
  if ((isLoggedIn && router.pathname === HOME_PATH) || router.isFallback) {
    return (
      <PlaceholderWrapper minH="100vh" isLoading loadingMessage="Loading..." />
    );
  }

  // direct user to login page if user has yet to login
  if (!isLoggedIn && ALL_ROUTES.includes(router.pathname)) {
    return <LoginPage />;
  }

  return <>{children}</>;
}

export default RouteHandler;

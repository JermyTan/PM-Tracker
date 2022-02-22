import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import PlaceholderWrapper from "../components/placeholder-wrapper";
import { HOME_PATH } from "../routes/paths";

const CatchAllPage: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    router.push(HOME_PATH);
  }, [router]);

  return (
    <PlaceholderWrapper minH="100vh" isLoading loadingMessage="Loading..." />
  );
};

export default CatchAllPage;

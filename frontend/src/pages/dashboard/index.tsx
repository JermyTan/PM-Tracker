import { Button } from "@chakra-ui/react";
import { NextPage } from "next";
import { useDispatch } from "react-redux";
import loggedOut from "../../redux/thunks/logged-out";

const DashboardPage: NextPage = () => {
  const dispatch = useDispatch();

  return (
    <>
      <h1>Dashboard</h1>
      <Button onClick={() => dispatch(loggedOut())}>Logout</Button>
    </>
  );
};

export default DashboardPage;

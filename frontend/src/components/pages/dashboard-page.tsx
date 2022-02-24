import { Button, Link } from "@chakra-ui/react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import resetAppState from "../../redux/thunks/reset-app-state";
import {
  LOGIN_PATH,
  MY_ACCOUNT_PATH,
  MY_COURSES_PATH,
} from "../../routes/paths";

function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <h1>Dashboard</h1>
      <Button
        onClick={() => {
          dispatch(resetAppState());
          navigate(LOGIN_PATH);
        }}
      >
        Logout
      </Button>
      <Link as={RouterLink} to={MY_COURSES_PATH}>
        My courses
      </Link>
      <Link as={RouterLink} to={MY_ACCOUNT_PATH}>
        My account
      </Link>
    </>
  );
}

export default DashboardPage;

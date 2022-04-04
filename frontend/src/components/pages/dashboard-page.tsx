import { Button, Title } from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import resetAppState from "../../redux/thunks/reset-app-state";
import { LOGIN_PATH } from "../../routes/paths";

function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <>
      <Title>Dashboard</Title>

      <Button
        onClick={() => {
          dispatch(resetAppState());
          navigate(LOGIN_PATH);
        }}
      >
        Logout
      </Button>
    </>
  );
}

export default DashboardPage;

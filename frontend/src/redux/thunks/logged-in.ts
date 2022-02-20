import { AuthenticationData } from "../../types/auth";
import { updateCurrentUser } from "../slices/current-user-slice";
import { setRememberMe } from "../slices/remember-me-slice";
import { AppThunk } from "../store";

const loggedIn =
  (currentUser: AuthenticationData, rememberMe: boolean): AppThunk =>
  (dispatch) => {
    dispatch(setRememberMe(rememberMe));
    dispatch(updateCurrentUser(currentUser));
  };

export default loggedIn;

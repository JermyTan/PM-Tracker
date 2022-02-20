import { updateCurrentUser } from "../slices/current-user-slice";
import { AppThunk } from "../store";

const loggedOut = (): AppThunk => (dispatch) => {
  // add actions here to clean up app state upon logout
  dispatch(updateCurrentUser(null));
};

export default loggedOut;

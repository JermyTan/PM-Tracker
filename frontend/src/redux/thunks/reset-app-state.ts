import { updateCurrentUser } from "../slices/current-user-slice";
import type { AppThunk } from "../store";

const resetAppState = (): AppThunk => (dispatch) => {
  // add actions here to clean up app state upon logout
  dispatch(updateCurrentUser(null));
};

export default resetAppState;

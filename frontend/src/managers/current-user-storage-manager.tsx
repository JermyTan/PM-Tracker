import { useEffect } from "react";
import { CURRENT_USER } from "../constants";
import { useAppDispatch } from "../redux/hooks";
import { addAppListener } from "../redux/listener-middleware";
import {
  selectCurrentUser,
  updateCurrentUser,
} from "../redux/slices/current-user-slice";
import { selectRememberMe } from "../redux/slices/remember-me-slice";
import { storage } from "../utils/storage-utils";

function CurrentUserStorageManager() {
  const dispatch = useAppDispatch();

  useEffect(
    () =>
      dispatch(
        addAppListener({
          actionCreator: updateCurrentUser,
          effect: (_, listenerApi) => {
            // for throttling
            listenerApi.unsubscribe();
            setTimeout(() => listenerApi.subscribe(), 200);

            const rootState = listenerApi.getState();
            const rememberMe = selectRememberMe(rootState);
            const currentUser = selectCurrentUser(rootState);

            if (currentUser === null) {
              // remove from both local and session storage
              storage.local.save(CURRENT_USER, null);
              storage.session.save(CURRENT_USER, null);

              console.log(
                `${CURRENT_USER} cleared from both local and session storages`,
              );
            } else {
              (rememberMe ? storage.local : storage.session).save(
                CURRENT_USER,
                currentUser,
              );

              console.log(
                `${
                  rememberMe ? "Local" : "Session"
                } storage updated: key: ${CURRENT_USER}, value: ${JSON.stringify(
                  currentUser,
                )}`,
              );
            }
          },
        }),
      ),
    [dispatch],
  );

  return null;
}

export default CurrentUserStorageManager;

import { useEffect } from "react";
import { REMEMBER_ME } from "../constants";
import {
  selectRememberMe,
  setRememberMe,
} from "../redux/slices/remember-me-slice";
import { storage } from "../utils/storage-utils";
import { useAppDispatch } from "../redux/hooks";
import { addAppListener } from "../redux/listener-middleware";

function RememberMeStorageManager() {
  const dispatch = useAppDispatch();

  useEffect(
    () =>
      dispatch(
        addAppListener({
          actionCreator: setRememberMe,
          effect: (_, listenerApi) => {
            const rememberMe = selectRememberMe(listenerApi.getState());
            storage.local.save(REMEMBER_ME, rememberMe);

            console.log(
              `Local storage updated: key: ${REMEMBER_ME}, value: ${rememberMe.toString()}`,
            );
          },
        }),
      ),
    [dispatch],
  );

  return null;
}

export default RememberMeStorageManager;

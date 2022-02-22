import { useEffect } from "react";
import { CURRENT_USER } from "../constants";
import { selectCurrentUser } from "../redux/slices/current-user-slice";
import { subscribeToStore } from "../redux/store";
import { storage } from "../utils/storage-utils";

function CurrentUserStorageManager() {
  useEffect(
    () =>
      subscribeToStore(selectCurrentUser, (currentUser, { rememberMe }) => {
        if (currentUser === null) {
          // remove from both local and session storage
          storage.local.save(CURRENT_USER, null);
          storage.session.save(CURRENT_USER, null);
        } else {
          (rememberMe ? storage.local : storage.session).save(
            CURRENT_USER,
            currentUser,
          );
        }
      }),
    [],
  );

  return null;
}

export default CurrentUserStorageManager;

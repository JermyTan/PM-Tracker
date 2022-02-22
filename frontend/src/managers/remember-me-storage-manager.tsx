import { useEffect } from "react";
import { REMEMBER_ME } from "../constants";
import { selectRememberMe } from "../redux/slices/remember-me-slice";
import { storage } from "../utils/storage-utils";
import { subscribeToStore } from "../redux/store";

function RememberMeStorageManager() {
  useEffect(
    () =>
      subscribeToStore(selectRememberMe, (rememberMe) =>
        storage.local.save(REMEMBER_ME, rememberMe),
      ),
    [],
  );

  return null;
}

export default RememberMeStorageManager;

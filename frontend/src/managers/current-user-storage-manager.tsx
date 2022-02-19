import { useEffect } from "react";
import { CURRENT_USER } from "../constants";
import { useAppSelector } from "../redux/hooks";
import { selectCurrentUser } from "../redux/slices/current-user-slice";
import { selectRememberMe } from "../redux/slices/remember-me-slice";
import { storage } from "../utils/storage-utils";

function CurrentUserStorageManager() {
  const currentUser = useAppSelector(selectCurrentUser);
  const rememberMe = useAppSelector(selectRememberMe);
  const storageService = rememberMe ? storage.local : storage.session;

  useEffect(() => {
    // may run twice when currentUser + rememberMe both changes
    console.log("test");
    storageService.save(CURRENT_USER, currentUser);
  }, [currentUser, storageService]);

  return null;
}

export default CurrentUserStorageManager;

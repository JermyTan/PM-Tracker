import { useEffect } from "react";
import { REMEMBER_ME } from "../constants";
import { useAppSelector } from "../redux/hooks";
import { selectRememberMe } from "../redux/slices/remember-me-slice";
import { storage } from "../utils/storage-utils";

function RememberMeStorageManager() {
  const rememberMe = useAppSelector(selectRememberMe);

  useEffect(() => {
    console.log(rememberMe);
    storage.local.save(REMEMBER_ME, rememberMe);
  }, [rememberMe]);

  return null;
}

export default RememberMeStorageManager;

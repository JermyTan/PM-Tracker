import { useEffect } from "react";
import { useAppDispatch } from "../redux/hooks";
import { addAppListener } from "../redux/listener-middleware";
import baseApi from "../redux/services/base-api";
import {
  selectCurrentUser,
  updateCurrentUser,
} from "../redux/slices/current-user-slice";

function ApiCacheManager() {
  const dispatch = useAppDispatch();

  useEffect(
    () =>
      dispatch(
        addAppListener({
          predicate: (action, currentState) =>
            action.type === updateCurrentUser.type &&
            selectCurrentUser(currentState) === null,
          effect: (_, listenerApi) => {
            // for throttling
            listenerApi.unsubscribe();
            setTimeout(() => listenerApi.subscribe(), 200);

            // clear api cache when current user is set to null
            listenerApi.dispatch(baseApi.util.resetApiState());

            console.log("Api cache cleared");
          },
        }),
      ),
    [dispatch],
  );

  return null;
}

export default ApiCacheManager;

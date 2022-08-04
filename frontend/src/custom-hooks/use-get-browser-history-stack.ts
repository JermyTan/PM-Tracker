import { useContext } from "react";
import { BrowserHistoryStackContext } from "../contexts/browser-history-stack-provider";

export default function useGetBrowserHistoryStack() {
  const { historyStack } = useContext(BrowserHistoryStackContext);

  return historyStack;
}

import { useAppSelector } from "../redux/hooks";

export default function useGetCurrentUserAccountType() {
  return useAppSelector(({ currentUser }) => currentUser?.user?.accountType);
}

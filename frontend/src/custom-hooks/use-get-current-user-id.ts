import { useAppSelector } from "../redux/hooks";

export default function useGetCurrentUserId() {
  return useAppSelector(({ currentUser }) => currentUser?.user?.id);
}

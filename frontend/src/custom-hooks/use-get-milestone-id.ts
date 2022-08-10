import { useParams } from "react-router-dom";

export default function useGetMilestoneId() {
  const { milestoneId } = useParams();
  return milestoneId;
}

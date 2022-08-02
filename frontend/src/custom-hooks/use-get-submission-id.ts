import { useParams } from "react-router-dom";

export default function useGetSubmissionId() {
  const { submissionId } = useParams();
  return submissionId;
}

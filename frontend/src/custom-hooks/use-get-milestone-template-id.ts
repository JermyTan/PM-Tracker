import { useParams } from "react-router-dom";

export function useGetMilestoneTemplateId() {
  const { templateId } = useParams();
  return templateId;
}

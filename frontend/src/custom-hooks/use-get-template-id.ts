import { useParams } from "react-router-dom";

export function useGetTemplateId() {
  const { templateId } = useParams();
  return templateId;
}

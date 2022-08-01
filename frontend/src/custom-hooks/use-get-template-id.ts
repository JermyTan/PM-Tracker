import { useParams } from "react-router-dom";

export default function useGetTemplateId() {
  const { templateId } = useParams();
  return templateId;
}

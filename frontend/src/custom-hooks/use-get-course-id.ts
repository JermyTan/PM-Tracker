import { useParams } from "react-router-dom";

export function useGetCourseId() {
  const { courseId } = useParams();
  return courseId;
}

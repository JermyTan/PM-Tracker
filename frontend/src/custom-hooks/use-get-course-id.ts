import { useParams } from "react-router-dom";

export default function useGetCourseId() {
  const { courseId } = useParams();
  return courseId;
}

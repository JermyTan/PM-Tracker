import { useSearchParams } from "react-router-dom";
import { SubmissionComment } from "../types/comments";
import useGetCourseId from "./use-get-course-id";
import useGetCurrentUserId from "./use-get-current-user-id";
import useGetSubmissionId from "./use-get-submission-id";

export default function useGetSubmissionCommentPermissions(
  comment?: SubmissionComment,
) {
  const courseId = useGetCourseId();
  const submissionId = useGetSubmissionId();
  const [searchParams] = useSearchParams();
  const fieldIndex = searchParams.get("field");

  const canRender =
    courseId !== undefined && submissionId !== undefined && fieldIndex !== null;
  const canCreate = canRender;

  const userId = useGetCurrentUserId();

  if (!comment) {
    return {
      canRender,
      canCreate,
      canModify: false,
      canDelete: false,
    };
  }

  const { isDeleted, commenter } = comment;

  const canModify = userId === commenter.id && !isDeleted;
  const canDelete = canModify;

  return {
    canRender,
    canCreate,
    canModify,
    canDelete,
  };
}

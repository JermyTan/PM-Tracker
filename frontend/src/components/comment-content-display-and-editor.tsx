import { Text } from "@mantine/core";
import { CONTENT } from "../constants";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import useGetSubmissionId from "../custom-hooks/use-get-submission-id";
import { useUpdateSubmissionCommentMutation } from "../redux/services/comments-api";
import { SubmissionFieldComment } from "../types/comments";
import toastUtils from "../utils/toast-utils";
import CommentEditForm, { CommentFormData } from "./comment-edit-form";
import TextViewer from "./text-viewer";

type Props = {
  isEditingComment: boolean;
  comment: SubmissionFieldComment;
  onEditSuccess: () => void;
};

function CommentContentDisplayAndEditor({
  isEditingComment,
  comment,
  onEditSuccess,
}: Props) {
  const [editComment] = useUpdateSubmissionCommentMutation();
  const courseId = useGetCourseId();
  const submissionId = useGetSubmissionId() ?? 1; // TODO: replace
  const commentId = comment.id;

  const handleEditComment = async (parsedData: CommentFormData) => {
    if (courseId === undefined || submissionId === undefined) {
      return;
    }

    const commentUpdateData: CommentFormData = {
      content: parsedData[CONTENT],
    };

    await editComment({
      ...commentUpdateData,
      courseId,
      submissionId,
      commentId,
    }).unwrap();

    toastUtils.success({
      message: "The comment has been updated successfully.",
    });
    onEditSuccess();
  };

  return isEditingComment ? (
    <CommentEditForm
      defaultValue={comment.content}
      confirmButtonName="Save"
      onSuccess={onEditSuccess}
      onSubmit={handleEditComment}
    />
  ) : (
    <TextViewer size="sm" preserveWhiteSpace overflowWrap withLinkify>
      {comment.content}
    </TextViewer>
  );
}

export default CommentContentDisplayAndEditor;

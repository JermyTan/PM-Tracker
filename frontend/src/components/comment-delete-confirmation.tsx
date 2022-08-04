import { Group, Text, Space, Button } from "@mantine/core";
import { useDeleteSubmissionCommentMutation } from "../redux/services/comments-api";
import { useResolveError } from "../utils/error-utils";
import toastUtils from "../utils/toast-utils";

type Props = {
  courseId: number;
  submissionId: number;
  commentId: number;
  onSuccess?: () => void;
};

function CommentDeleteConfirmation({
  courseId,
  submissionId,
  commentId,
  onSuccess,
}: Props) {
  const [deleteComment, { isLoading }] = useDeleteSubmissionCommentMutation();

  const { resolveError } = useResolveError();

  const onDeleteComment = async () => {
    try {
      await deleteComment({ courseId, submissionId, commentId }).unwrap();

      toastUtils.success({
        message: "The comment has been deleted successfully.",
      });

      onSuccess?.();
    } catch (error) {
      resolveError(error);
    }
  };

  return (
    <>
      <Text size="sm">
        Are you sure you want to delete this comment?
        <br />
        <strong>This action is irreversible.</strong>
      </Text>
      <Space h="md" />
      <Group position="right">
        <Button color="gray" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          color="red"
          onClick={onDeleteComment}
          loading={isLoading}
          disabled={isLoading}
        >
          Delete comment
        </Button>
      </Group>
    </>
  );
}

export default CommentDeleteConfirmation;

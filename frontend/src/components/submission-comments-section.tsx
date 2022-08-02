import { Paper, Stack } from "@mantine/core";
import { useGetSubmissionCommentsQuery } from "../redux/services/comments-api";
import CommentDisplay from "./comment-display";
import PlaceholderWrapper from "./placeholder-wrapper";

function SubmissionCommentsSection() {
  const courseId = 1;
  const submissionId = 1;
  const fieldIndex = 0;
  const {
    data: comments,
    isLoading,
    error,
  } = useGetSubmissionCommentsQuery({
    courseId,
    submissionId,
    fieldIndex,
  });

  console.log("COMMENTS:", comments);

  return (
    <Paper withBorder shadow="sm" p="md" radius="md">
      <PlaceholderWrapper
        py={10}
        isLoading={isLoading}
        loadingMessage="Loading comments..."
        defaultMessage="No comments yet."
        showDefaultMessage={!comments || comments?.length === 0}
      >
        <Stack>
          {comments?.map((comment) => (
            <CommentDisplay comment={comment} />
          ))}
        </Stack>
      </PlaceholderWrapper>
    </Paper>
  );
}

export default SubmissionCommentsSection;

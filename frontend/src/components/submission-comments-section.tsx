import { Avatar, Group, Paper, Stack } from "@mantine/core";
import { useGetSubmissionCommentsQuery } from "../redux/services/comments-api";
import CommentDisplay from "./comment-display";

function SubmissionCommentsSection() {
  const courseId = 1;
  const submissionId = 16;
  const {
    data: comments,
    isLoading,
    error,
  } = useGetSubmissionCommentsQuery({
    courseId: courseId,
    submissionId: submissionId,
  });

  return (
    <>
      {comments?.keys.map((fieldComments) => (
        <Paper withBorder shadow="sm" p="md" radius="md">
          <Stack>
            {/* {fieldComments?.map((comment) => (
              <CommentDisplay comment={comment} />
            ))} */}
          </Stack>
        </Paper>
      ))}
    </>
  );
}

export default SubmissionCommentsSection;

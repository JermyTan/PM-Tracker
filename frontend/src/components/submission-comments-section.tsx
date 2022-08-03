import { Avatar, Paper, Stack, Space, Group } from "@mantine/core";
import { CONTENT } from "../constants";
import { useAppSelector } from "../redux/hooks";
import {
  useCreateSubmissionCommentMutation,
  useGetSubmissionCommentsQuery,
} from "../redux/services/comments-api";
import { useCreateSubmissionMutation } from "../redux/services/submissions-api";
import toastUtils from "../utils/toast-utils";
import CommentDisplay from "./comment-display";
import CommentEditForm, {
  CommentCreateOrUpdateData,
} from "./comment-edit-form";
import PlaceholderWrapper from "./placeholder-wrapper";

type Props = {
  fieldIndex: number;
  courseId: number;
  submissionId: number;
};

function SubmissionCommentsSection({
  fieldIndex,
  courseId,
  submissionId,
}: Props) {
  const currentUser = useAppSelector(({ currentUser }) => currentUser?.user);

  const { comments, isLoading } = useGetSubmissionCommentsQuery(
    {
      courseId,
      submissionId,
      fieldIndex: fieldIndex,
    },
    {
      selectFromResult: ({ data: comments, isLoading }) => ({
        comments,
        isLoading,
      }),
    },
  );
  const [createComment] = useCreateSubmissionCommentMutation();

  const handleCreateComment = async (parsedData: CommentCreateOrUpdateData) => {
    const commentPostData: CommentCreateOrUpdateData = {
      content: parsedData[CONTENT],
    };

    await createComment({
      ...commentPostData,
      courseId,
      submissionId,
      fieldIndex,
    }).unwrap();

    toastUtils.success({ message: "Succesfully created comment." });
  };

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
      <Space h="lg" />
      <Group align="flex-start" noWrap>
        <Avatar
          src={currentUser?.profileImage}
          alt={currentUser?.name}
          radius="xl"
        />

        <CommentEditForm
          defaultValue={""}
          confirmButtonName={"Comment"}
          showCancelButton={false}
          onSubmit={handleCreateComment}
        />
      </Group>
    </Paper>
  );
}

export default SubmissionCommentsSection;

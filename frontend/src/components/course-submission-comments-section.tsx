import { Avatar, Paper, Stack, Space, Group } from "@mantine/core";
import { UseFormReset } from "react-hook-form";
import { CONTENT } from "../constants";
import { useAppSelector } from "../redux/hooks";
import {
  useCreateSubmissionCommentMutation,
  useGetSubmissionCommentsQuery,
} from "../redux/services/comments-api";
import toastUtils from "../utils/toast-utils";
import CommentDisplay from "./comment-display";
import CommentEditForm, { CommentFormData } from "./comment-edit-form";
import PlaceholderWrapper from "./placeholder-wrapper";

type Props = {
  fieldIndex: number;
  courseId: string | number;
  submissionId: number;
};

function CourseSubmissionCommentsSection({
  fieldIndex,
  courseId,
  submissionId,
}: Props) {
  const currentUser = useAppSelector(({ currentUser }) => currentUser?.user);

  const { comments, isLoading } = useGetSubmissionCommentsQuery(
    {
      courseId,
      submissionId,
      fieldIndex,
    },
    {
      selectFromResult: ({ data: comments, isLoading }) => ({
        comments,
        isLoading,
      }),
    },
  );
  const [createComment] = useCreateSubmissionCommentMutation();

  const handleCreateComment = async (
    parsedData: CommentFormData,
    reset: UseFormReset<CommentFormData>,
  ) => {
    const commentPostData: CommentFormData = {
      content: parsedData[CONTENT],
    };

    await createComment({
      ...commentPostData,
      courseId,
      submissionId,
      fieldIndex,
    }).unwrap();

    toastUtils.success({ message: "Succesfully created comment." });
    reset({ [CONTENT]: "" });
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
            <CommentDisplay
              comment={comment}
              courseId={courseId}
              submissionId={submissionId}
            />
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
          defaultValue=""
          confirmButtonName="Comment"
          onSubmit={handleCreateComment}
        />
      </Group>
    </Paper>
  );
}

export default CourseSubmissionCommentsSection;

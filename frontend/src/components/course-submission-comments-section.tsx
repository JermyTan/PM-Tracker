import {
  Paper,
  Stack,
  PaperProps,
  LoadingOverlay,
  ScrollArea,
} from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useSearchParams } from "react-router-dom";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import useGetSubmissionId from "../custom-hooks/use-get-submission-id";
import { useGetSubmissionCommentsQuery } from "../redux/services/comments-api";
import { useResolveError } from "../utils/error-utils";
import CommentDisplay from "./comment-display";
import PlaceholderWrapper from "./placeholder-wrapper";

type Props<T> = Omit<PaperProps<T>, "children">;

function CourseSubmissionCommentsSection<T = "div">(props: Props<T>) {
  const courseId = useGetCourseId();
  const submissionId = useGetSubmissionId();
  const [searchParams] = useSearchParams();
  const fieldIndex = searchParams.get("field");
  const invalidState =
    courseId === undefined || submissionId === undefined || fieldIndex === null;

  const { comments, isLoading, isFetching, error } =
    useGetSubmissionCommentsQuery(
      invalidState
        ? skipToken
        : {
            courseId,
            submissionId,
            fieldIndex,
          },
      {
        selectFromResult: ({
          data: comments,
          isLoading,
          isFetching,
          error,
        }) => ({
          comments,
          isLoading,
          isFetching,
          error,
        }),
      },
    );
  useResolveError({ error, name: "course-submission-comments-section" });
  // const [createComment] = useCreateSubmissionCommentMutation();

  // const handleCreateComment = async (
  //   parsedData: CommentFormData,
  //   reset: UseFormReset<CommentFormData>,
  // ) => {
  //   const commentPostData: CommentFormData = {
  //     content: parsedData[CONTENT],
  //   };

  //   await createComment({
  //     ...commentPostData,
  //     courseId,
  //     submissionId,
  //     fieldIndex,
  //   }).unwrap();

  //   toastUtils.success({ message: "Succesfully created comment." });
  //   reset({ [CONTENT]: "" });
  // };

  if (invalidState) {
    return null;
  }

  return (
    <Paper {...props}>
      <ScrollArea
        sx={{ height: "1000px" }}
        pr="xs"
        scrollbarSize={8}
        offsetScrollbars
      >
        <PlaceholderWrapper
          py={150}
          isLoading={isLoading}
          loadingMessage="Loading comments..."
          defaultMessage="No comments yet."
          showDefaultMessage={!comments || comments?.length === 0}
        >
          <LoadingOverlay visible={isFetching} />
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
      </ScrollArea>
      {/* <Space h="lg" />
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
      </Group> */}
    </Paper>
  );
}

export default CourseSubmissionCommentsSection;

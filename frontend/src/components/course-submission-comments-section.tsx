import {
  Paper,
  PaperProps,
  LoadingOverlay,
  ScrollArea,
  createStyles,
  Box,
  Divider,
} from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import {
  ComponentPropsWithoutRef,
  ElementRef,
  ElementType,
  useLayoutEffect,
  useRef,
} from "react";
import { useSearchParams } from "react-router-dom";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import useGetSubmissionId from "../custom-hooks/use-get-submission-id";
import {
  useCreateSubmissionCommentMutation,
  useGetSubmissionCommentsQuery,
} from "../redux/services/comments-api";
import { useResolveError } from "../utils/error-utils";
import toastUtils from "../utils/toast-utils";
import CommentCard from "./comment-card";
import CommentForm, { CommentFormData } from "./comment-form";
import PlaceholderWrapper from "./placeholder-wrapper";

const useStyles = createStyles({
  sectionContainer: {
    position: "relative",
    width: "400px",
    height: "100%",
    display: "flex",
    flexDirection: "column",
  },
  commentsContainer: {
    flex: "1 1 auto",
    overflow: "hidden",
  },
  scrollAreaContainer: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
  },
  placeholder: {
    height: "100%",
  },
});

type Props<C extends ElementType> = Omit<
  PaperProps & ComponentPropsWithoutRef<C>,
  "children"
>;

function CourseSubmissionCommentsSection<C extends ElementType = "div">({
  className,
  ...props
}: Props<C>) {
  const courseId = useGetCourseId();
  const submissionId = useGetSubmissionId();
  const { classes, cx } = useStyles();
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
        refetchOnMountOrArgChange: true,
      },
    );
  useResolveError({ error, name: "course-submission-comments-section" });
  const [createComment, { isCreating }] = useCreateSubmissionCommentMutation({
    selectFromResult: ({ isLoading: isCreating }) => ({ isCreating }),
  });
  const formRef = useRef<ElementRef<typeof CommentForm>>(null);
  const hasCreatedComment = useRef(false);
  const commentsViewPortRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (
      hasCreatedComment.current &&
      comments &&
      commentsViewPortRef.current &&
      commentsViewPortRef.current.scrollHeight > 0
    ) {
      hasCreatedComment.current = false;
      commentsViewPortRef.current.scrollTo({
        top: commentsViewPortRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [comments]);

  if (invalidState) {
    return null;
  }

  const onCreate = async (formData: CommentFormData) => {
    if (isCreating) {
      return;
    }

    await createComment({
      ...formData,
      courseId,
      submissionId,
      fieldIndex,
    }).unwrap();

    hasCreatedComment.current = true;

    toastUtils.success({
      message: "The new comment has been created successfully.",
    });

    formRef.current?.reset({ content: "" });
  };

  return (
    <>
      <Divider orientation="vertical" />
      <Paper className={cx(className, classes.sectionContainer)} {...props}>
        <LoadingOverlay visible={!isLoading && isFetching} />
        <div className={classes.commentsContainer}>
          <PlaceholderWrapper
            className={classes.placeholder}
            py={150}
            isLoading={isLoading}
            loadingMessage="Loading comments..."
            defaultMessage="No comments."
            showDefaultMessage={!comments || comments?.length === 0}
          >
            <Box className={classes.scrollAreaContainer} pl="md" pb="md">
              <ScrollArea
                scrollbarSize={8}
                offsetScrollbars
                type="auto"
                viewportRef={commentsViewPortRef}
                pr="md"
              >
                {comments?.map((comment) => (
                  <CommentCard key={comment.id} {...comment} />
                ))}
              </ScrollArea>
            </Box>
          </PlaceholderWrapper>
        </div>

        <Box px="md" pb="md">
          <CommentForm ref={formRef} type="new" onSubmit={onCreate} />
        </Box>
      </Paper>
    </>
  );
}

export default CourseSubmissionCommentsSection;

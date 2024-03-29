import { Button, createStyles } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { BiCommentDetail, BiCommentEdit } from "react-icons/bi";
import { useSearchParams } from "react-router-dom";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import useGetSubmissionId from "../custom-hooks/use-get-submission-id";
import { useGetSubmissionCommentCountQueryState } from "../redux/services/comments-api";

const useStyles = createStyles({
  button: {
    minWidth: "initial",
  },
});

type Props = {
  fieldIndex: number;
};

function FormFieldCommentButton({ fieldIndex }: Props) {
  const courseId = useGetCourseId();
  const submissionId = useGetSubmissionId();
  const [searchParams, setSearchParams] = useSearchParams();
  const { classes } = useStyles();
  const { count, isFetching, isError } = useGetSubmissionCommentCountQueryState(
    courseId === undefined || submissionId === undefined
      ? skipToken
      : { courseId, submissionId },
    {
      selectFromResult: ({ data: counts, isFetching, isError }) => ({
        count: counts?.[fieldIndex] ?? 0,
        isFetching,
        isError,
      }),
    },
  );
  const isActive = searchParams.get("field") === `${fieldIndex}`;

  const onClick = () => {
    if (isActive) {
      searchParams.delete("field");
    } else {
      searchParams.set("field", `${fieldIndex}`);
    }

    setSearchParams(searchParams);
  };

  return (
    <Button
      variant={isActive ? "filled" : "light"}
      onClick={onClick}
      color={isError ? "red" : "violet"}
      compact
      leftIcon={isError ? <BiCommentEdit /> : <BiCommentDetail />}
      className={classes.button}
      loading={isFetching}
      aria-label={isActive ? "Close comments" : "View comments"}
    >
      {!isFetching && (isError ? "Error" : count)}
    </Button>
  );
}

export default FormFieldCommentButton;

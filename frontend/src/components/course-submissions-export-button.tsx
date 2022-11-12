import { useState } from "react";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { Button } from "@mantine/core";
import { TbTableExport } from "react-icons/tb";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import useGetMilestoneId from "../custom-hooks/use-get-milestone-id";
import { useLazyGetSubmissionsQuery } from "../redux/services/submissions-api";
import { emptySelector } from "../redux/utils";
import { useResolveError } from "../utils/error-utils";
import {
  isSubmissionDataWithComments,
  parseToSubmissionCsvFiles,
} from "../utils/transform-utils";
import { SubmissionDataWithComments } from "../types/submissions";
import { useGetSingleMilestoneQueryState } from "../redux/services/milestones-api";

type Props = {
  disabled?: boolean;
};

function CourseSubmissionsExportButton({ disabled }: Props) {
  const courseId = useGetCourseId();
  const milestoneId = useGetMilestoneId();
  const { milestone } = useGetSingleMilestoneQueryState(
    courseId === undefined || milestoneId === undefined
      ? skipToken
      : { courseId, milestoneId },
    {
      selectFromResult: ({ data: milestone }) => ({
        milestone,
      }),
    },
  );
  const [getSubmissions] = useLazyGetSubmissionsQuery({
    selectFromResult: emptySelector,
  });
  const { resolveError } = useResolveError({
    name: "course-submissions-export-button",
  });
  const [isLoading, setLoading] = useState(false);

  const isExportable =
    !disabled &&
    courseId !== undefined &&
    milestoneId !== undefined &&
    milestone !== undefined;

  const onExport = async () => {
    if (!isExportable) {
      return;
    }

    try {
      setLoading(true);

      const submissions = await getSubmissions({
        courseId,
        milestoneId,
        full: true,
      }).unwrap();

      const submissionsWithComments = submissions.filter(
        isSubmissionDataWithComments,
      ) as SubmissionDataWithComments[];

      const submissionCsvFiles = parseToSubmissionCsvFiles(
        submissionsWithComments,
      );

      const zip = new JSZip();

      Object.entries(submissionCsvFiles).forEach(([filename, data]) =>
        zip.file(`${filename}.csv`, data),
      );

      const zippedFile = await zip.generateAsync({ type: "blob" });

      saveAs(zippedFile, `submissions - ${milestone.name}.zip`);
    } catch (error) {
      resolveError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={onExport}
      disabled={!isExportable}
      loading={isLoading}
      leftIcon={<TbTableExport />}
    >
      Export submissions
    </Button>
  );
}

export default CourseSubmissionsExportButton;

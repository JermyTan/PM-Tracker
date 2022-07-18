import { createStyles, Table } from "@mantine/core";
import { useMemo } from "react";
import { generatePath, useNavigate } from "react-router-dom";
import {
  DATE_TIME_MONTH_NAME_FORMAT,
  NAME,
  SUBMISSION_TYPE,
} from "../constants";
import { useGetCourseId } from "../custom-hooks/use-get-course-id";
import { useGetTemplateId } from "../custom-hooks/use-get-template-id";
import { COURSE_MILESTONE_TEMPLATES_PATH } from "../routes/paths";
import { TemplateData } from "../types/templates";
import { colorModeValue } from "../utils/theme-utils";
import {
  capitalizeSubmissionType,
  displayDateTime,
  sort,
} from "../utils/transform-utils";

const useStyles = createStyles((theme) => ({
  row: {
    cursor: "pointer",
  },
  active: {
    backgroundColor: colorModeValue(theme.colorScheme, {
      lightModeValue: theme.colors.gray[1],
      darkModeValue: theme.colors.dark[5],
    }),
  },
}));

type Props = {
  milestoneTemplates: TemplateData[];
};

function MilestoneTemplatesTable({ milestoneTemplates }: Props) {
  const { cx, classes } = useStyles();
  const navigate = useNavigate();
  const sortedMilestoneTemplates = useMemo(
    () =>
      sort(milestoneTemplates, {
        key: [NAME, SUBMISSION_TYPE, (a, b) => b.updatedAt - a.updatedAt],
      }),
    [milestoneTemplates],
  );
  const templateId = useGetTemplateId();
  const courseId = useGetCourseId();

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Submission type</th>
          <th>Published</th>
          <th>Last updated at</th>
        </tr>
      </thead>
      <tbody>
        {sortedMilestoneTemplates.map(
          ({ id, name, submissionType, isPublished, updatedAt }) => (
            <tr
              key={id}
              className={cx(
                classes.row,
                templateId === `${id}` && classes.active,
              )}
              onClick={() => {
                const stringId = `${id}`;
                navigate(
                  templateId === stringId
                    ? generatePath(COURSE_MILESTONE_TEMPLATES_PATH, {
                        courseId,
                      })
                    : stringId,
                );
              }}
            >
              <td>{name}</td>
              <td>{capitalizeSubmissionType(submissionType)}</td>
              <td>{isPublished ? "✅" : "❌"}</td>
              <td>{displayDateTime(updatedAt, DATE_TIME_MONTH_NAME_FORMAT)}</td>
            </tr>
          ),
        )}
      </tbody>
    </Table>
  );
}

export default MilestoneTemplatesTable;

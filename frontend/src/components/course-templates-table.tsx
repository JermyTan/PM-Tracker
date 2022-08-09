import { createStyles, Table } from "@mantine/core";
import path from "path";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  DATE_TIME_MONTH_NAME_FORMAT,
  NAME,
  SUBMISSION_TYPE,
} from "../constants";
import useGetTemplateId from "../custom-hooks/use-get-template-id";
import { TemplateData } from "../types/templates";
import { colorModeValue } from "../utils/theme-utils";
import { displayDateTime, sort } from "../utils/transform-utils";
import SubmissionTypeIconLabel from "./submission-type-icon-label";

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
  templates: TemplateData[];
  studentView?: boolean;
};

function CourseTemplatesTable({ templates, studentView }: Props) {
  const { cx, classes } = useStyles();
  const navigate = useNavigate();
  const sortedTemplates = useMemo(
    () =>
      sort(
        templates.filter(({ isPublished }) => !studentView || isPublished),
        {
          key: [NAME, SUBMISSION_TYPE, (a, b) => b.updatedAt - a.updatedAt],
        },
      ),
    [templates, studentView],
  );
  const templateId = useGetTemplateId();
  const { pathname } = useLocation();

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Submission type</th>
          {!studentView && <th>Published</th>}
          <th>Last updated at</th>
        </tr>
      </thead>
      <tbody>
        {sortedTemplates.map(
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
                    ? path.resolve(pathname, "../")
                    : stringId,
                );
              }}
            >
              <td>{id}</td>
              <td>{name}</td>
              <td>
                <SubmissionTypeIconLabel submissionType={submissionType} />
              </td>
              {!studentView && <td>{isPublished ? "✅" : "❌"}</td>}
              <td>{displayDateTime(updatedAt, DATE_TIME_MONTH_NAME_FORMAT)}</td>
            </tr>
          ),
        )}
      </tbody>
    </Table>
  );
}

export default CourseTemplatesTable;

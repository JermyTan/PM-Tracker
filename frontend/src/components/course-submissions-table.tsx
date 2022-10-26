import { Anchor, Badge, createStyles, Group, Table } from "@mantine/core";
import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { DATE_TIME_MONTH_NAME_FORMAT } from "../constants";
import { SubmissionSummaryData } from "../types/submissions";
import { colorModeValue } from "../utils/theme-utils";
import { sort, displayDateTime } from "../utils/transform-utils";
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
  submissions: SubmissionSummaryData[];
};

function CourseSubmissionsTable({ submissions }: Props) {
  const { cx, classes } = useStyles();
  const sortedSubmissions = useMemo(
    () =>
      sort(submissions, {
        key: (a, b) => b.updatedAt - a.updatedAt,
      }),
    [submissions],
  );
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedSubmissionId = searchParams.get("id");

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Submission type</th>
          <th>Submission group</th>
          <th>Last updated by</th>
          <th>Last updated at</th>
          <th>Visibility</th>
        </tr>
      </thead>
      <tbody>
        {sortedSubmissions.map(
          ({ id, name, submissionType, group, editor, updatedAt, isDraft }) => (
            <tr
              key={id}
              className={cx(
                classes.row,
                selectedSubmissionId === `${id}` && classes.active,
              )}
              onClick={() => {
                const stringId = `${id}`;

                if (selectedSubmissionId === stringId) {
                  searchParams.delete("id");
                } else {
                  searchParams.set("id", stringId);
                }

                setSearchParams(searchParams);
              }}
            >
              <td>{id}</td>
              <td>
                <Group spacing="xs">
                  <Anchor<typeof Link>
                    inherit
                    component={Link}
                    to={`${id}`}
                    onClick={(event) => {
                      event.stopPropagation();
                    }}
                  >
                    {name}
                  </Anchor>

                  {isDraft && (
                    <Badge size="sm" color="orange">
                      Draft
                    </Badge>
                  )}
                </Group>
              </td>
              <td>
                <SubmissionTypeIconLabel submissionType={submissionType} />
              </td>
              <td>{group?.name ?? ""}</td>
              <td>{editor?.name ?? ""}</td>
              <td>{displayDateTime(updatedAt, DATE_TIME_MONTH_NAME_FORMAT)}</td>
              <td>Private</td>
            </tr>
          ),
        )}
      </tbody>
    </Table>
  );
}

export default CourseSubmissionsTable;

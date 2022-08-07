import { Table } from "@mantine/core";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { DATE_TIME_MONTH_NAME_FORMAT } from "../constants";
import { SubmissionSummaryData } from "../types/submissions";
import { sort, displayDateTime } from "../utils/transform-utils";
import SubmissionTypeIconLabel from "./submission-type-icon-label";
import TextViewer from "./text-viewer";

type Props = {
  submissions: SubmissionSummaryData[];
};

function CourseSubmissionsTable({ submissions }: Props) {
  const navigate = useNavigate();
  const sortedSubmissions = useMemo(
    () =>
      sort(submissions, {
        key: (a, b) => b.updatedAt - a.updatedAt,
      }),
    [submissions],
  );

  console.log(sortedSubmissions);

  return (
    <Table highlightOnHover>
      <thead>
        <tr>
          <th>Name</th>
          <th>Submission type</th>
          <th>Group</th>
          <th>Last updated by</th>
          <th>Last updated at</th>
          <th>Visibility</th>
        </tr>
      </thead>
      <tbody>
        {sortedSubmissions.map(
          ({ id, name, submissionType, group, editor, updatedAt }) => (
            <tr
              key={id}
              //   onClick={() => {
              //     const stringId = `${id}`;
              //     navigate(
              //       templateId === stringId
              //         ? path.resolve(pathname, "../")
              //         : stringId,
              //     );
              //   }}
            >
              <td>{name}</td>
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

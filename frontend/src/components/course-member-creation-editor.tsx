import { Button, Group, Stack, Loader, Table, Badge } from "@mantine/core";
import papaparse from "papaparse";
import { z } from "zod";
import { MdPersonAdd } from "react-icons/md";
import { RiFileDownloadLine } from "react-icons/ri";
import { useState } from "react";
import toastUtils from "../utils/toast-utils";
import { useResolveError } from "../utils/error-utils";
import { useBatchCreateCourseMembershipsMutation } from "../redux/services/members-api";
import {
  CourseMemberData,
  CourseMembershipBatchCreateData,
} from "../types/courses";
import { EMAIL, NAME } from "../constants";
import CourseMemberCsvFileUploader from "./course-member-csv-file-uploader";

type Props = {
  courseId?: number | string;
  onSuccess?: () => void;
};

type MemberCreationCsvRowData = [string, string];

type MemberCreationData = z.infer<typeof schema>;

enum Status {
  New = "NEW",
  Created = "CREATED",
  Invalid = "INVALID",
}

const schema = z.object({
  [NAME]: z.string().trim().min(0),
  [EMAIL]: z
    .string()
    .trim()
    .min(1, "Please enter an email address")
    .email("Invalid email address"),
});

type TableRow = {
  data: MemberCreationData;
  status: Status;
};

function getStatusColor(status: Status): string {
  switch (status) {
    case Status.Created:
      return "green";
    case Status.Invalid:
      return "red";
    case Status.New:
      return "yellow";
    default:
      return "";
  }
}

function CourseMemberCreationEditor({ courseId, onSuccess }: Props) {
  const [isParsingCSV, setIsParsingCSV] = useState(false);
  const [tableRows, setTableRows] = useState<TableRow[]>([]);

  const { resolveError } = useResolveError();
  const [batchCreateCourseMemberships, { isLoading }] =
    useBatchCreateCourseMembershipsMutation({
      selectFromResult: ({ isLoading }) => ({ isLoading }),
    });

  const updateTableData = (newCreatedMembersData: CourseMemberData[]) => {
    const createdMemberEmailsSet = new Set(
      newCreatedMembersData.map((memberData) => memberData.user.email),
    );

    const updatedTableData: TableRow[] = tableRows.map((row) => {
      let { status } = row;
      const { data } = row;
      if (createdMemberEmailsSet.has(data.email)) {
        status = Status.Created;
      }

      return {
        data,
        status,
      };
    });

    setTableRows(updatedTableData);
  };

  const handleSubmitBatchMembershipCreation = async () => {
    if (courseId === undefined) {
      return;
    }

    const validatedData: MemberCreationData[] = tableRows
      .filter((row) => row.status === Status.New)
      .map((row) => row.data);

    if (validatedData.length === 0) {
      toastUtils.success({
        message: "No new members to add to the course.",
      });
      return;
    }

    const membershipsData: CourseMembershipBatchCreateData = {
      memberCreationData: validatedData,
    };

    try {
      await batchCreateCourseMemberships({
        courseId,
        ...membershipsData,
      })
        .unwrap()
        .then((payload) => {
          updateTableData(payload);

          toastUtils.success({ message: "Succesfully created memberships." });
        });
    } catch (error) {
      resolveError(error);
    }
  };

  const hasEmailData = tableRows.length !== 0;

  // TODO: download here
  const downloadCSVTemplate = () => {};

  const parseCSVTemplate = (files: File[]) => {
    const csvFile = files[0];

    if (!csvFile) {
      return;
    }

    setIsParsingCSV(true);

    /* eslint-disable @typescript-eslint/no-unsafe-call */
    papaparse.parse<MemberCreationCsvRowData, papaparse.LocalFile>(csvFile, {
      worker: true,
      error: (error: { message: string }) => {
        console.log("Parse CSV file error:", error, error.message);
        toastUtils.error({ message: error.message });
      },
      complete: ({ data }) => {
        // removes column headers
        data.shift();

        const userCreationData: TableRow[] = data.map((row) => {
          console.log("ROW:", row);
          const data: MemberCreationData = {
            email: row[0],
            name: row[1] ?? "",
          };

          let status: Status = Status.New;

          try {
            schema.parse(data);
          } catch (error) {
            status = Status.Invalid;
          }

          return {
            data,
            status,
          };
        });

        setTableRows(userCreationData);

        toastUtils.info({
          message: "The CSV file content has been successfully parsed.",
        });
      },
    });
    /* eslint-enable @typescript-eslint/no-unsafe-call */

    setIsParsingCSV(false);
  };

  const clearData = () => {
    setTableRows([]);
  };

  return (
    <Stack>
      <Group position="apart">
        <Button onClick={downloadCSVTemplate} leftIcon={<RiFileDownloadLine />}>
          Download CSV Template
        </Button>
        <Group hidden={!hasEmailData}>
          <Button onClick={clearData} disabled={isLoading} color="red">
            Clear Data
          </Button>
          <Button
            onClick={handleSubmitBatchMembershipCreation}
            disabled={isLoading}
            leftIcon={
              isLoading ? <Loader size={14} /> : <MdPersonAdd size={14} />
            }
          >
            Create New Members
          </Button>
        </Group>
      </Group>
      {hasEmailData ? (
        <Table striped>
          <thead>
            <tr>
              <th>Email</th>
              <th>Name (Optional)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, index) => (
              <tr key={index}>
                <td>{row.data.email}</td>
                <td>{row.data.name}</td>
                <td>
                  <Badge color={getStatusColor(row.status)}>{row.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <CourseMemberCsvFileUploader
          onDrop={parseCSVTemplate}
          isLoading={isParsingCSV}
        />
      )}
    </Stack>
  );
}

export default CourseMemberCreationEditor;

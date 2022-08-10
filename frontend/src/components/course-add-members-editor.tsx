import {
  Text,
  Button,
  Group,
  MantineTheme,
  useMantineTheme,
  Stack,
  Loader,
} from "@mantine/core";
import papaparse from "papaparse";
import { Dropzone, DropzoneStatus, MIME_TYPES } from "@mantine/dropzone";
import { IconType } from "react-icons";
import { MdPersonAdd } from "react-icons/md";
import { GrDocumentCsv, GrClose, GrClear } from "react-icons/gr";
import { RiFileDownloadLine } from "react-icons/ri";
import { FiUpload } from "react-icons/fi";
import { useState } from "react";
import toastUtils from "../utils/toast-utils";
import { useResolveError } from "../utils/error-utils";
import { useBatchCreateCourseMembershipsMutation } from "../redux/services/members-api";
import { emptySelector } from "../redux/utils";
import { CourseMembershipBatchCreateData } from "../types/courses";

type Props = {
  courseId?: number | string;
  onSuccess?: () => void;
};

type UserCreationCsvRowData = [string];

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
  // if (status.accepted) {
  //   return theme.colors[theme.primaryColor][
  //     theme.colorScheme === "dark" ? 4 : 6
  //   ];
  // }

  // if (status.rejected) {
  //   return theme.colors.red[theme.colorScheme === "dark" ? 4 : 6];
  // }

  if (theme.colorScheme === "dark") {
    return theme.colors.dark[0];
  }

  return theme.colors.gray[7];
}

function FileUploadIcon({
  status,
  ...props
}: React.ComponentProps<IconType> & { status: DropzoneStatus }) {
  // if (status.accepted) {
  //   return <FiUpload {...props} />;
  // }

  // if (status.rejected) {
  //   return <GrClose {...props} />;
  // }

  return <GrDocumentCsv {...props} />;
}

const dropzoneChildren = (status: DropzoneStatus, theme: MantineTheme) => (
  <Group
    position="center"
    spacing="xl"
    style={{ minHeight: 220, pointerEvents: "none" }}
  >
    <FileUploadIcon
      status={status}
      style={{ color: getIconColor(status, theme) }}
      size={80}
    />
    <div>
      <Text size="xl" inline>
        Drag images here or click to select files
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        Attach as many files as you like, each file should not exceed 5mb
      </Text>
    </div>
  </Group>
);

function CourseAddMembersEditor({ courseId, onSuccess }: Props) {
  const [isParsingCSV, setIsParsingCSV] = useState(false);
  const [userCreationDataList, setUserCreationDataList] = useState<string[]>(
    [],
  );

  const { resolveError } = useResolveError();
  const [batchCreateCourseMemberships, { isLoading }] =
    useBatchCreateCourseMembershipsMutation({
      selectFromResult: ({ isLoading }) => ({ isLoading }),
    });

  const handleSubmitBatchMembershipCreation = async () => {
    if (courseId === undefined) {
      return;
    }

    const membershipsData: CourseMembershipBatchCreateData = {
      user_emails: userCreationDataList,
    };

    console.log("MEMBERSHIPS DATA", membershipsData);

    try {
      await batchCreateCourseMemberships({
        courseId,
        ...membershipsData,
      }).unwrap();

      toastUtils.success({ message: "Succesfully created memberships." });
    } catch (error) {
      resolveError(error);
    }
  };

  const theme = useMantineTheme();

  const hasEmailData = userCreationDataList.length !== 0;

  const downloadCSVTemplate = () => {};

  const parseCSVTemplate = (files: File[]) => {
    const csvFile = files[0];

    if (!csvFile) {
      return;
    }

    setIsParsingCSV(true);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    papaparse.parse<UserCreationCsvRowData>(csvFile, {
      worker: true,
      error: (error) => {
        console.log("Parse CSV file error:", error, error.message);
        toastUtils.error({ message: error.message });
      },
      complete: ({ data }) => {
        // removes column headers
        data.shift();

        const userCreationData = data
          .filter((row) => row.length)
          .map((row) => row[0]);
        setUserCreationDataList(userCreationData);

        toastUtils.info({
          message: "The CSV file content has been successfully parsed.",
        });
      },
    });

    setIsParsingCSV(false);
  };

  const clearData = () => {
    setUserCreationDataList([]);
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
            Submit
          </Button>
        </Group>
      </Group>
      {hasEmailData ? (
        <>
          {userCreationDataList.map((email) => (
            <Text>{email}</Text>
          ))}
        </>
      ) : (
        <Dropzone
          accept={[MIME_TYPES.csv]}
          onDrop={(files) => {
            parseCSVTemplate(files as File[]);
          }}
          onReject={() => {
            toastUtils.error({
              message:
                "Error uploading file. Please ensure that a valid CSV file is uploaded.",
            });
          }}
          loading={isParsingCSV}
        >
          {(status) => dropzoneChildren(status, theme)}
        </Dropzone>
      )}
    </Stack>
  );
}

export default CourseAddMembersEditor;

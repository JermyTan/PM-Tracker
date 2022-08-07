import {
  Text,
  Button,
  Group,
  MantineTheme,
  useMantineTheme,
  Stack,
} from "@mantine/core";
import papaparse from "papaparse";
import { Dropzone, DropzoneStatus, MIME_TYPES } from "@mantine/dropzone";
import { IconType } from "react-icons";
import { GrDocumentCsv, GrClose } from "react-icons/gr";
import { FiUpload } from "react-icons/fi";
import { useState } from "react";
import toastUtils from "../utils/toast-utils";

type Props = {
  courseId?: number | string;
  onSuccess?: () => void;
};

type UserCreationCsvRowData = [string];

type UserCreationData = {
  email: string;
};

function csvToDisplayData(data: UserCreationCsvRowData): UserCreationData {
  return {
    email: data[0],
  };
}

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
  console.log("STATUS:", status);
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
  const [userCreationDataList, setUserCreationDataList] =
    useState<UserCreationData[]>();

  const theme = useMantineTheme();

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

        const userCreationData = data.map((row) => csvToDisplayData(row));
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
        <Button onClick={downloadCSVTemplate}>Download CSV Template</Button>
        <Group hidden={!userCreationDataList}>
          <Button onClick={clearData} color="red">
            Clear Data
          </Button>
          <Button onClick={downloadCSVTemplate}>Submit</Button>
        </Group>
      </Group>
      {userCreationDataList ? (
        <>
          {userCreationDataList.map((data) => (
            <Text>{data.email}</Text>
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

import {
  Text,
  Button,
  Group,
  useMantineTheme,
  Stack,
  Loader,
} from "@mantine/core";
import papaparse from "papaparse";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { MdPersonAdd } from "react-icons/md";
import { GrDocumentCsv, GrClose, GrClear } from "react-icons/gr";
import { RiFileDownloadLine } from "react-icons/ri";
import { FiUpload } from "react-icons/fi";
import { useState } from "react";
import toastUtils from "../utils/toast-utils";
import { useResolveError } from "../utils/error-utils";
import { useBatchCreateCourseMembershipsMutation } from "../redux/services/members-api";
import { CourseMembershipBatchCreateData } from "../types/courses";
import { MEMBER_CREATION_DATA } from "../constants";

type Props = {
  courseId?: number | string;
  onSuccess?: () => void;
};

type MemberCreationCsvRowData = [string, string];

type MemberCreationData = {
  email: string;
  name: string;
};

function CourseMemberCreationEditor({ courseId, onSuccess }: Props) {
  const [isParsingCSV, setIsParsingCSV] = useState(false);
  const [memberCreationDataList, setMemberCreationDataList] = useState<
    MemberCreationData[]
  >([]);

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
      memberCreationData: memberCreationDataList.map((memberData) => ({
        email: memberData.email,
        name: memberData.name,
      })),
    };

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

  const hasEmailData = memberCreationDataList.length !== 0;

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

        const userCreationData: MemberCreationData[] = data
          .filter((row) => row.length >= 1)
          .map((row) => ({
            email: row[0],
            name: row[1],
          }));

        setMemberCreationDataList(userCreationData);

        toastUtils.info({
          message: "The CSV file content has been successfully parsed.",
        });
      },
    });
    /* eslint-enable @typescript-eslint/no-unsafe-call */

    setIsParsingCSV(false);
  };

  const clearData = () => {
    setMemberCreationDataList([]);
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
          {memberCreationDataList.map((data) => (
            <Text>
              {data.email}
              {data.name}
            </Text>
          ))}
        </>
      ) : (
        <Dropzone
          onDrop={(files) => {
            parseCSVTemplate(files);
          }}
          onReject={() => {
            toastUtils.error({
              message:
                "Error uploading file. Please ensure that a valid CSV file is uploaded.",
            });
          }}
          maxSize={3 * 1024 ** 2}
          accept={[MIME_TYPES.csv]}
          loading={isParsingCSV}
        >
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 220, pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <FiUpload
                size={50}
                color={
                  theme.colors[theme.primaryColor][
                    theme.colorScheme === "dark" ? 4 : 6
                  ]
                }
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <GrClose
                size={50}
                color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <GrDocumentCsv size={50} />
            </Dropzone.Idle>

            <div>
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed
                5mb
              </Text>
            </div>
          </Group>
        </Dropzone>
      )}
    </Stack>
  );
}

export default CourseMemberCreationEditor;

import { Text, Group, useMantineTheme } from "@mantine/core";
import { Dropzone, MIME_TYPES } from "@mantine/dropzone";
import { GrDocumentCsv, GrClose } from "react-icons/gr";
import { FiUpload } from "react-icons/fi";
import toastUtils from "../utils/toast-utils";

type Props = {
  onDrop: (files: File[]) => void;
  isLoading: boolean;
};

function CourseMemberCsvFileUploader({ onDrop, isLoading }: Props) {
  const theme = useMantineTheme();

  return (
    <Dropzone
      onDrop={(files) => {
        onDrop(files);
      }}
      onReject={() => {
        toastUtils.error({
          message:
            "Error uploading file. Please ensure that a valid CSV file is uploaded.",
        });
      }}
      maxSize={3 * 1024 ** 2}
      accept={[MIME_TYPES.csv]}
      loading={isLoading}
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
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
}

export default CourseMemberCsvFileUploader;

import { Group, Text } from "@mantine/core";
import {
  SubmissionType,
  submissionTypeToPropertiesMap,
} from "../types/templates";

type Props = {
  submissionType: SubmissionType;
};

function SubmissionTypeIconLabel({ submissionType }: Props) {
  const { label, icon } = submissionTypeToPropertiesMap[submissionType];
  const Icon = icon;

  return (
    <Group noWrap spacing={4}>
      <Icon />
      <Text inherit>{label}</Text>
    </Group>
  );
}

export default SubmissionTypeIconLabel;

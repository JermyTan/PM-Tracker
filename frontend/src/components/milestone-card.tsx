import { Paper, Text } from "@mantine/core";
import { MilestoneData } from "../types/milestones";

type Props = MilestoneData;

function MilestoneCard({
  id,
  name,
  description,
  startDateTime,
  endDateTime,
  isPublished,
}: Props) {
  return (
    <Paper withBorder shadow="sm" p="md" radius="md">
      <Text>{name}</Text>
      <Text size="sm">{description}</Text>
    </Paper>
  );
}

export default MilestoneCard;

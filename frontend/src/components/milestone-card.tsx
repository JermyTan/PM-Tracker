import { Alert, Badge, createStyles, Group, Paper, Stack } from "@mantine/core";
import { HiEyeOff } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import useGetMilestoneAlias from "../custom-hooks/use-get-milestone-alias";
import useGetMilestonePermissions from "../custom-hooks/use-get-milestone-permissions";
import { MilestoneData } from "../types/milestones";
import MilestoneActionsMenu from "./milestone-actions-menu";
import MilestoneActivePeriodDisplay from "./milestone-active-period-display";
import ConditionalRenderer from "./conditional-renderer";
import TextViewer from "./text-viewer";

const useStyles = createStyles((_, { canAccess }: { canAccess?: boolean }) => ({
  card: {
    cursor: canAccess ? "pointer" : "not-allowed",
  },
}));

type Props = MilestoneData;

function MilestoneCard(props: Props) {
  const { milestoneAlias } = useGetMilestoneAlias();
  const navigate = useNavigate();
  const { canAccess, canModify, canDelete } = useGetMilestonePermissions(props);
  const { classes } = useStyles({ canAccess });

  const { name, startDateTime, endDateTime, isPublished, id } = props;
  const now = Date.now();
  const isOpen =
    startDateTime <= now && (endDateTime === null || now <= endDateTime);

  return (
    <Paper
      onClick={canAccess ? () => navigate(`${id}`) : undefined}
      withBorder
      shadow="sm"
      p="md"
      radius="md"
      className={classes.card}
    >
      <Stack spacing="xs">
        <Group noWrap spacing={4} position="apart" align="flex-start">
          <TextViewer overflowWrap weight={600} size="lg">
            {name}
          </TextViewer>
          <ConditionalRenderer allow={canModify || canDelete}>
            <MilestoneActionsMenu {...props} />
          </ConditionalRenderer>
        </Group>
        <MilestoneActivePeriodDisplay
          startDateTime={startDateTime}
          endDateTime={endDateTime}
        />
        <div>
          <Badge variant="outline" color={isOpen ? "green" : "red"}>
            {isOpen ? "Open" : "Closed"}
          </Badge>
        </div>
        {!isPublished && (
          <Alert
            p="xs"
            color="orange"
            icon={<HiEyeOff />}
            title="Not published"
          >
            Students cannot view this {milestoneAlias}.
          </Alert>
        )}
      </Stack>
    </Paper>
  );
}

export default MilestoneCard;

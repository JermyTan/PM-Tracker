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
import { checkIsMilestoneOpen } from "../utils/misc-utils";

const useStyles = createStyles((_, { canAccess }: { canAccess?: boolean }) => ({
  card: {
    cursor: canAccess ? "pointer" : "not-allowed",
  },
  contentContainer: {
    height: "100%",
  },
}));

type Props = MilestoneData;

function MilestoneCard(props: Props) {
  const { milestoneAlias } = useGetMilestoneAlias();
  const navigate = useNavigate();
  const { canAccess, canModify, canDelete } = useGetMilestonePermissions(props);
  const { classes } = useStyles({ canAccess });

  const { name, startDateTime, endDateTime, isPublished, id } = props;
  const isOpen = checkIsMilestoneOpen(props);

  return (
    <Paper
      onClick={canAccess ? () => navigate(`${id}`) : undefined}
      withBorder
      shadow="sm"
      p="md"
      radius="md"
      className={classes.card}
    >
      <Stack
        className={classes.contentContainer}
        spacing="xs"
        justify="space-between"
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
            size="sm"
            weight={500}
          />
          <div>
            <Badge variant="outline" color={isOpen ? "green" : "red"}>
              {isOpen ? "Open" : "Closed"}
            </Badge>
          </div>
        </Stack>
        {/* <FlexSpacer /> */}

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

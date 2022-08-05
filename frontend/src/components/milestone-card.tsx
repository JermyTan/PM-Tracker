import { Alert, Badge, Group, Paper, Stack } from "@mantine/core";
import { HiEyeOff } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import useGetMilestoneAlias from "../custom-hooks/use-get-milestone-alias";
import { Role } from "../types/courses";
import { MilestoneData } from "../types/milestones";
import MilestoneActionsMenu from "./milestone-actions-menu";
import MilestoneActivePeriodDisplay from "./milestone-active-period-display";
import RoleRestrictedWrapper from "./role-restricted-wrapper";
import TextViewer from "./text-viewer";

type Props = MilestoneData;

function MilestoneCard(props: Props) {
  const { milestoneAlias } = useGetMilestoneAlias();
  const navigate = useNavigate();

  const { name, startDateTime, endDateTime, isPublished, id } = props;
  const now = Date.now();
  const isOpen =
    startDateTime <= now && (endDateTime === null || now <= endDateTime);

  return (
    <Paper
      onClick={() => navigate(`${id}`)}
      withBorder
      shadow="sm"
      p="md"
      radius="md"
    >
      <Stack spacing="xs">
        <Group noWrap spacing={4} position="apart" align="flex-start">
          <TextViewer overflowWrap weight={600} size="lg">
            {name}
          </TextViewer>
          <RoleRestrictedWrapper allowedRoles={[Role.CoOwner, Role.Instructor]}>
            <MilestoneActionsMenu {...props} />
          </RoleRestrictedWrapper>
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

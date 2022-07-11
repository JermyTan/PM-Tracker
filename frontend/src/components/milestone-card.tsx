import {
  Alert,
  Badge,
  Box,
  createStyles,
  Group,
  Paper,
  Stack,
  Text,
} from "@mantine/core";
import { HiEyeOff } from "react-icons/hi";
import { DATE_TIME_MONTH_NAME_FORMAT } from "../constants";
import { useGetMilestoneAlias } from "../custom-hooks/use-get-milestone-alias";
import { Role } from "../types/courses";
import { MilestoneData } from "../types/milestones";
import { displayDateTime } from "../utils/transform-utils";
import MilestoneActionsMenu from "./milestone-actions-menu";
import RoleRestrictedWrapper from "./role-restricted-wrapper";

const useStyles = createStyles({
  title: {
    overflowWrap: "anywhere",
  },
});

type Props = MilestoneData;

function MilestoneCard(props: Props) {
  const { classes } = useStyles();
  const milestoneAlias = useGetMilestoneAlias();

  const { name, startDateTime, endDateTime, isPublished } = props;
  const now = Date.now();
  const isOpen =
    startDateTime <= now && (endDateTime === null || now <= endDateTime);

  return (
    <Paper withBorder shadow="sm" p="md" radius="md">
      <Stack spacing="xs">
        <Group noWrap spacing={4} position="apart" align="flex-start">
          <Text weight={600} size="lg" className={classes.title}>
            {name}
          </Text>
          <RoleRestrictedWrapper allowedRoles={[Role.CoOwner, Role.Instructor]}>
            <MilestoneActionsMenu {...props} />
          </RoleRestrictedWrapper>
        </Group>
        <Box>
          <Text size="sm">
            Start:{" "}
            <Text<"span"> weight={500} size="sm" component="span">
              {displayDateTime(startDateTime, DATE_TIME_MONTH_NAME_FORMAT)}
            </Text>
          </Text>
          {endDateTime !== null && (
            <Text size="sm">
              End:{" "}
              <Text<"span"> weight={500} size="sm" component="span">
                {displayDateTime(endDateTime, DATE_TIME_MONTH_NAME_FORMAT)}
              </Text>
            </Text>
          )}
        </Box>
        <Box>
          <Badge variant="outline" color={isOpen ? "green" : "red"}>
            {isOpen ? "Open" : "Closed"}
          </Badge>
        </Box>
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

import {
  Alert,
  Badge,
  Box,
  createStyles,
  Group,
  Menu,
  Modal,
  Paper,
  Stack,
  Text,
  Button,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { HiEyeOff } from "react-icons/hi";
import { MdDelete, MdEdit } from "react-icons/md";
import { DATE_TIME_MONTH_NAME_FORMAT } from "../constants";
import { useGetCourseId } from "../custom-hooks/use-get-course-id";
import { useGetMilestoneAlias } from "../custom-hooks/use-get-milestone-alias";
import { useDeleteMilestoneMutation } from "../redux/services/milestones-api";
import { MilestoneData } from "../types/milestones";
import { useResolveError } from "../utils/error-utils";
import toastUtils from "../utils/toast-utils";
import { displayDateTime } from "../utils/transform-utils";

const useStyles = createStyles({
  title: {
    overflowWrap: "anywhere",
  },
});

type Props = MilestoneData;

function MilestoneCard({
  id: milestoneId,
  name,
  startDateTime,
  endDateTime,
  isPublished,
}: Props) {
  const { classes } = useStyles();
  const courseId = useGetCourseId();
  const [
    isDeleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const milestoneAlias = useGetMilestoneAlias();
  const [deleteMilestone, { isDeleting }] = useDeleteMilestoneMutation({
    selectFromResult: ({ isLoading: isDeleting }) => ({ isDeleting }),
  });
  const resolveError = useResolveError();

  const now = Date.now();
  const isOpen =
    startDateTime <= now && (endDateTime === null || now <= endDateTime);

  const onDeleteMilestone = async () => {
    if (isDeleting || courseId === undefined) {
      return;
    }

    try {
      await deleteMilestone({ courseId, milestoneId }).unwrap();

      toastUtils.success({
        message: `The ${milestoneAlias} has been successfully deleted.`,
      });
      closeDeleteModal();
    } catch (error) {
      resolveError(error);
    }
  };

  return (
    <Paper withBorder shadow="sm" p="md" radius="md">
      <Modal
        opened={isDeleteModalOpened}
        onClose={closeDeleteModal}
        centered
        title={`Delete ${milestoneAlias}`}
      >
        <Stack>
          <Text size="sm">
            Are you sure you want to delete this {milestoneAlias} (
            <strong>{name}</strong>)?
          </Text>
          <Group position="right">
            <Button variant="default" onClick={closeDeleteModal}>
              No don&apos;t delete
            </Button>
            <Button
              color="red"
              loading={isDeleting}
              onClick={onDeleteMilestone}
            >
              Delete {milestoneAlias}
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Stack spacing="xs">
        <Group noWrap spacing={4} position="apart" align="flex-start">
          <Text weight={600} size="lg" className={classes.title}>
            {name}
          </Text>
          <Menu>
            <Menu.Item icon={<MdEdit />}>Edit {milestoneAlias}</Menu.Item>
            <Menu.Item
              color="red"
              icon={<MdDelete />}
              onClick={openDeleteModal}
            >
              Delete {milestoneAlias}
            </Menu.Item>
          </Menu>
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

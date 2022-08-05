import {
  Button,
  Drawer,
  Group,
  Menu,
  Modal,
  ScrollArea,
  Stack,
  Title,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { MdEdit, MdDelete } from "react-icons/md";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import useGetMilestoneAlias from "../custom-hooks/use-get-milestone-alias";
import { useDeleteMilestoneMutation } from "../redux/services/milestones-api";
import { MilestoneData } from "../types/milestones";
import { useResolveError } from "../utils/error-utils";
import toastUtils from "../utils/toast-utils";
import MilestoneEditForm from "./milestone-edit-form";

type Props = MilestoneData;

function MilestoneActionsMenu({ id: milestoneId, name }: Props) {
  const courseId = useGetCourseId();
  const { milestoneAlias, capitalizedMilestoneAlias } = useGetMilestoneAlias();
  const [
    isDeleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [isEditDrawerOpened, { open: openEditDrawer, close: closeEditDrawer }] =
    useDisclosure(false);
  const [deleteMilestone, { isDeleting }] = useDeleteMilestoneMutation({
    selectFromResult: ({ isLoading: isDeleting }) => ({ isDeleting }),
  });
  const { resolveError } = useResolveError({ name: "milestone-actions-menu" });

  const onDeleteMilestone = async () => {
    if (isDeleting || courseId === undefined) {
      return;
    }

    try {
      await deleteMilestone({ courseId, milestoneId }).unwrap();

      toastUtils.success({
        message: `The ${milestoneAlias} has been deleted successfully.`,
      });
      closeDeleteModal();
    } catch (error) {
      resolveError(error);
    }
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-static-element-interactions
    <div
      onClick={(event) => {
        event.stopPropagation();
      }}
      onKeyDown={() => {}}
    >
      <Drawer
        opened={isEditDrawerOpened}
        onClose={closeEditDrawer}
        position="right"
        size="xl"
        padding="lg"
        closeButtonLabel={`Cancel ${milestoneAlias} update`}
        title={<Title order={2}>{capitalizedMilestoneAlias} Update</Title>}
      >
        {/* special case: this conditional render is required as milestone edit form is mounted and api call will be made
        even though the drawer is not yet opened */}
        {isEditDrawerOpened && (
          <ScrollArea offsetScrollbars pr="xs" scrollbarSize={8}>
            <MilestoneEditForm
              milestoneId={milestoneId}
              onSuccess={closeEditDrawer}
            />
          </ScrollArea>
        )}
      </Drawer>

      <Modal
        opened={isDeleteModalOpened}
        onClose={closeDeleteModal}
        centered
        title={`Delete ${milestoneAlias}`}
        closeButtonLabel={`Cancel ${milestoneAlias} deletion`}
      >
        <Stack>
          <Text size="sm">
            Are you sure you want to delete this {milestoneAlias} (
            <strong>{name}</strong>)?
            <br />
            <strong>This action is destructive and irreversible.</strong>
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

      <Menu>
        <Menu.Item icon={<MdEdit />} onClick={openEditDrawer}>
          Edit {milestoneAlias}
        </Menu.Item>
        <Menu.Item color="red" icon={<MdDelete />} onClick={openDeleteModal}>
          Delete {milestoneAlias}
        </Menu.Item>
      </Menu>
    </div>
  );
}

export default MilestoneActionsMenu;

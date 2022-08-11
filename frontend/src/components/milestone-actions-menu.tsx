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
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { RiMoreLine } from "react-icons/ri";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import useGetMilestoneAlias from "../custom-hooks/use-get-milestone-alias";
import useGetMilestonePermissions from "../custom-hooks/use-get-milestone-permissions";
import { useDeleteMilestoneMutation } from "../redux/services/milestones-api";
import { MilestoneData } from "../types/milestones";
import { useResolveError } from "../utils/error-utils";
import toastUtils from "../utils/toast-utils";
import MilestoneEditForm from "./milestone-edit-form";
import ConditionalRenderer from "./conditional-renderer";

type Props = MilestoneData;

function MilestoneActionsMenu(props: Props) {
  const { id: milestoneId, name } = props;
  const { canModify, canDelete } = useGetMilestonePermissions(props);
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
      <ConditionalRenderer allow={canModify}>
        <Drawer
          opened={isEditDrawerOpened}
          onClose={closeEditDrawer}
          position="right"
          size="xl"
          padding="lg"
          closeButtonLabel={`Cancel ${milestoneAlias} update`}
          title={<Title order={3}>{capitalizedMilestoneAlias} Update</Title>}
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
      </ConditionalRenderer>

      <ConditionalRenderer allow={canDelete}>
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
      </ConditionalRenderer>

      <Menu position="bottom-start">
        <Menu.Target>
          <ActionIcon>
            <RiMoreLine />
          </ActionIcon>
        </Menu.Target>

        <Menu.Dropdown>
          <ConditionalRenderer allow={canModify}>
            <Menu.Item icon={<FaEdit />} onClick={openEditDrawer}>
              Edit {milestoneAlias}
            </Menu.Item>
          </ConditionalRenderer>

          <ConditionalRenderer allow={canDelete}>
            <Menu.Item
              color="red"
              icon={<FaTrashAlt size={12} />}
              onClick={openDeleteModal}
            >
              Delete {milestoneAlias}
            </Menu.Item>
          </ConditionalRenderer>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}

export default MilestoneActionsMenu;

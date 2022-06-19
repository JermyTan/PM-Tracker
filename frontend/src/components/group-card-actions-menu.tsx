import { Menu, ActionIcon, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { FaChevronDown, FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdLogout, MdPersonAdd } from "react-icons/md";

import {
  useDeleteCourseGroupMutation,
  useUpdateCourseGroupMutation,
} from "../redux/services/groups-api";
import { Course } from "../types/courses";
import { GroupPatchAction } from "../types/groups";
import toastUtils from "../utils/toast-utils";

type Props = {
  course?: Course;
  courseId?: number | string;
  groupId?: number;
  groupName?: string;
  hasAdminPermission?: boolean;
  userIsInGroup?: boolean;
};

function GroupCardActionsMenu({
  course,
  courseId,
  groupId,
  groupName,
  hasAdminPermission,
  userIsInGroup,
}: Props) {
  const [updateGroup, { isLoading: isJoiningOrLeavingGroup }] =
    useUpdateCourseGroupMutation();
  const [deleteGroup, { isLoading: isDeletingGroup }] =
    useDeleteCourseGroupMutation();
  const modals = useModals();

  const canJoinGroup =
    !userIsInGroup && (hasAdminPermission || course?.allowStudentsToJoinGroups);

  const canLeaveGroup =
    userIsInGroup && (hasAdminPermission || course?.allowStudentsToLeaveGroups);

  const canEditMembers =
    hasAdminPermission ||
    (userIsInGroup && course?.allowStudentsToAddOrRemoveGroupMembers);

  const canDeleteGroup =
    hasAdminPermission ||
    (userIsInGroup && course?.allowStudentsToDeleteGroups);

  const canModifyGroupName =
    hasAdminPermission ||
    (userIsInGroup && course?.allowStudentsToModifyGroupName);

  const onJoinOrLeaveGroup = async (
    action: GroupPatchAction,
    userId: number | null,
  ) => {
    if (
      isJoiningOrLeavingGroup ||
      courseId === undefined ||
      groupId === undefined
    ) {
      return;
    }

    const groupPutData = {
      action,
      payload: {
        userId,
      },
    };
    await updateGroup({ ...groupPutData, courseId, groupId }).unwrap();

    // TODO: update message for diff actions and handle error cases
    toastUtils.success({
      message: `The group has been updated successfully.`,
    });
    // onSuccess?.();
  };

  const onDeleteCourseGroup = async () => {
    if (courseId === undefined || groupId === undefined) {
      return;
    }

    await deleteGroup({ courseId, groupId }).unwrap();

    toastUtils.success({
      message: `The group has been successfully deleted.`,
    });
  };

  const openDeleteGroupModal = () =>
    modals.openConfirmModal({
      title: "Delete group",
      closeButtonLabel: "Cancel group deletion",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this group?
          <br />
          <strong>This action is irreversible.</strong>
        </Text>
      ),
      labels: { confirm: "Delete group", cancel: "Cancel" },
      confirmProps: { color: "red", loading: isDeletingGroup },
      onConfirm: onDeleteCourseGroup,
    });

  const openJoinGroupModal = () =>
    modals.openConfirmModal({
      title: "Join group",
      closeButtonLabel: "Cancel joining group",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to join this group?
          {!hasAdminPermission && !course?.allowStudentsToLeaveGroups && (
            <div>
              <br />
              <strong>Once you join a group, you cannot leave.</strong>
            </div>
          )}
        </Text>
      ),
      labels: { confirm: "Join group", cancel: "Cancel" },
      confirmProps: { color: "green", loading: isJoiningOrLeavingGroup },
      onConfirm: () => {
        onJoinOrLeaveGroup(GroupPatchAction.Join, null);
      },
    });

  const openLeaveGroupModal = () =>
    modals.openConfirmModal({
      title: "Leave group",
      closeButtonLabel: "Cancel leaving group",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to leave this group?
          {!hasAdminPermission && !course?.allowStudentsToJoinGroups && (
            <div>
              <br />
              <strong>Once you leave a group, you cannot join it again.</strong>
            </div>
          )}
        </Text>
      ),
      labels: { confirm: "Leave group", cancel: "Cancel" },
      confirmProps: { color: "red", loading: isJoiningOrLeavingGroup },
      onConfirm: () => {
        onJoinOrLeaveGroup(GroupPatchAction.Leave, null);
      },
    });

  // TODO: disable menu if no items

  return (
    <Menu
      control={
        <ActionIcon>
          <FaChevronDown />
        </ActionIcon>
      }
      placement="end"
    >
      {canJoinGroup && (
        <Menu.Item
          icon={<MdPersonAdd size={14} />}
          onClick={openJoinGroupModal}
        >
          Join group
        </Menu.Item>
      )}
      {canEditMembers && (
        <Menu.Item icon={<FaEdit size={14} />}>Edit members</Menu.Item>
      )}
      {canLeaveGroup && (
        <Menu.Item icon={<MdLogout size={14} />} onClick={openLeaveGroupModal}>
          Leave group
        </Menu.Item>
      )}
      {canDeleteGroup && (
        <Menu.Item
          icon={<FaTrashAlt size={14} color="red" />}
          onClick={openDeleteGroupModal}
        >
          Delete group
        </Menu.Item>
      )}
    </Menu>
  );
}

export default GroupCardActionsMenu;

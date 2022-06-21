import { Menu, ActionIcon, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { FaChevronDown, FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdLogout, MdPersonAdd, MdPeopleAlt } from "react-icons/md";
import { NAME } from "../constants";
import {
  useDeleteCourseGroupMutation,
  useJoinOrLeaveCourseGroupMutation,
  useRenameCourseGroupMutation,
} from "../redux/services/groups-api";
import { Course } from "../types/courses";
import { GroupPatchAction, GroupData } from "../types/groups";
import toastUtils from "../utils/toast-utils";
import GroupNameForm, { GroupNameData } from "./group-name-form";

type Props = {
  course?: Course;
  group?: GroupData;
  hasAdminPermission?: boolean;
  userIsInGroup?: boolean;
};

function GroupCardActionsMenu({
  course,
  group,
  hasAdminPermission,
  userIsInGroup,
}: Props) {
  const [joinOrLeaveGroup, { isLoading: isJoiningOrLeavingGroup }] =
    useJoinOrLeaveCourseGroupMutation();
  const [deleteGroup, { isLoading: isDeletingGroup }] =
    useDeleteCourseGroupMutation();

  const [renameGroup] = useRenameCourseGroupMutation();

  const modals = useModals();
  const courseId = course?.id;
  const groupId = group?.id;

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

  const hasAvailableActions =
    canJoinGroup ||
    canLeaveGroup ||
    canEditMembers ||
    canDeleteGroup ||
    canModifyGroupName;

  const onJoinOrLeaveGroup = async (action: GroupPatchAction) => {
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
        userId: null,
      },
    };
    await joinOrLeaveGroup({ ...groupPutData, courseId, groupId }).unwrap();

    toastUtils.success({
      message: `The group has been updated successfully.`,
    });
  };

  const onDeleteCourseGroup = async () => {
    if (courseId === undefined || groupId === undefined || isDeletingGroup) {
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
        onJoinOrLeaveGroup(GroupPatchAction.Join);
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
        onJoinOrLeaveGroup(GroupPatchAction.Leave);
      },
    });

  const handleRenameRequest = async (parsedData: GroupNameData) => {
    if (courseId === undefined || groupId === undefined) {
      return;
    }

    const renameData = {
      action: GroupPatchAction.Modify,
      payload: {
        name: parsedData[NAME],
      },
    };

    await renameGroup({ ...renameData, courseId, groupId }).unwrap();

    toastUtils.success({ message: "Succesfully renamed group." });
  };

  const openRenameGroupModal = () => {
    const id = modals.openModal({
      title: "Rename group",
      children: (
        <GroupNameForm
          defaultValue={group?.name ?? ""}
          onSubmit={handleRenameRequest}
          onSuccess={() => {
            modals.closeModal(id);
          }}
        />
      ),
    });
  };

  return (
    <Menu
      control={
        <ActionIcon>
          <FaChevronDown />
        </ActionIcon>
      }
      placement="end"
      hidden={!hasAvailableActions}
    >
      <Menu.Item
        icon={<FaEdit size={14} />}
        onClick={openRenameGroupModal}
        hidden={!canModifyGroupName}
      >
        Rename group
      </Menu.Item>
      <Menu.Item
        icon={<MdPersonAdd size={14} />}
        onClick={openJoinGroupModal}
        hidden={!canJoinGroup}
      >
        Join group
      </Menu.Item>
      <Menu.Item icon={<MdPeopleAlt size={14} />} hidden={!canEditMembers}>
        Edit members
      </Menu.Item>
      <Menu.Item
        icon={<MdLogout size={14} />}
        onClick={openLeaveGroupModal}
        hidden={!canLeaveGroup}
      >
        Leave group
      </Menu.Item>
      <Menu.Item
        icon={<FaTrashAlt size={14} color="red" />}
        onClick={openDeleteGroupModal}
        hidden={!canDeleteGroup}
      >
        Delete group
      </Menu.Item>
    </Menu>
  );
}

export default GroupCardActionsMenu;

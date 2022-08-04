import { Menu, ActionIcon, Loader } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { FaChevronDown, FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdLogout, MdPersonAdd, MdPeopleAlt } from "react-icons/md";
import { NAME } from "../constants";
import { usePatchCourseGroupMutation } from "../redux/services/groups-api";
import { CourseData } from "../types/courses";
import { GroupPatchAction, GroupData, GroupPatchData } from "../types/groups";
import toastUtils from "../utils/toast-utils";
import GroupDeleteOption from "./group-delete-option";
import GroupNameForm, { GroupNameData } from "./group-name-form";
import GroupJoinOrLeaveConfirmation from "./group-join-or-leave-confirmation";
import { useResolveError } from "../utils/error-utils";
import GroupEditMembersMenu from "./group-edit-members-menu";

type Props = {
  course?: CourseData;
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
    usePatchCourseGroupMutation();

  const [renameGroup] = usePatchCourseGroupMutation();

  const modals = useModals();
  const courseId = course?.id;
  const groupId = group?.id;

  const { resolveError } = useResolveError();

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

    const groupPatchData: GroupPatchData = {
      action,
      payload: {
        userId: null,
      },
    };

    const actionPastTense =
      action === GroupPatchAction.Join ? "joined" : "left";

    try {
      await joinOrLeaveGroup({ ...groupPatchData, courseId, groupId }).unwrap();

      toastUtils.success({
        message: `You have successfully ${actionPastTense} the group${
          group ? ` "${group.name}"` : ""
        }.`,
      });
    } catch (error) {
      resolveError(error);
    }
  };

  const openJoinGroupModal = () => {
    const id = modals.openModal({
      title: "Join group",
      children: (
        <GroupJoinOrLeaveConfirmation
          action={GroupPatchAction.Join}
          course={course}
          group={group}
          onSuccess={() => modals.closeModal(id)}
        />
      ),
    });
  };

  const openLeaveGroupModal = () => {
    const id = modals.openModal({
      title: "Leave group",
      children: (
        <GroupJoinOrLeaveConfirmation
          action={GroupPatchAction.Leave}
          course={course}
          group={group}
          onSuccess={() => modals.closeModal(id)}
        />
      ),
    });
  };

  const openDeleteGroupModal = () => {
    const id = modals.openModal({
      title: "Delete group",
      children: (
        <GroupDeleteOption
          course={course}
          group={group}
          onSuccess={() => modals.closeModal(id)}
        />
      ),
    });
  };

  const openEditMembersMenu = () => {
    const id = modals.openModal({
      title: "Add or remove members",
      children: (
        <GroupEditMembersMenu
          groupId={group?.id}
          groupUserData={group?.members}
          courseId={courseId}
          userCourseRole={course?.role}
          userIsInGroup={userIsInGroup}
        />
      ),
      size: 800,
    });
  };

  const shouldShowWarningModalOnJoin =
    !hasAdminPermission && !course?.allowStudentsToLeaveGroups;

  const onJoinGroup = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldShowWarningModalOnJoin) {
      openJoinGroupModal();
      return;
    }

    onJoinOrLeaveGroup(GroupPatchAction.Join);
  };

  const shouldShowWarningModalOnLeave =
    !hasAdminPermission && !course?.allowStudentsToJoinGroups;

  const onLeaveGroup = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (shouldShowWarningModalOnLeave) {
      openLeaveGroupModal();
      return;
    }

    onJoinOrLeaveGroup(GroupPatchAction.Leave);
  };

  const handleRenameRequest = async (parsedData: GroupNameData) => {
    if (courseId === undefined || groupId === undefined) {
      return;
    }

    const renameData: GroupPatchData = {
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
          confirmButtonName="Save changes"
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
      closeOnScroll
    >
      <Menu.Item
        icon={<FaEdit size={14} />}
        onClick={openRenameGroupModal}
        hidden={!canModifyGroupName}
      >
        Rename group
      </Menu.Item>
      <Menu.Item
        icon={
          isJoiningOrLeavingGroup ? (
            <Loader size={14} />
          ) : (
            <MdPersonAdd size={14} />
          )
        }
        onClick={onJoinGroup}
        hidden={!canJoinGroup}
        disabled={isJoiningOrLeavingGroup}
      >
        Join group
      </Menu.Item>
      <Menu.Item
        icon={<MdPeopleAlt size={14} />}
        onClick={openEditMembersMenu}
        hidden={!canEditMembers}
      >
        Edit members
      </Menu.Item>
      <Menu.Item
        icon={
          isJoiningOrLeavingGroup ? (
            <Loader size={14} />
          ) : (
            <MdLogout size={14} />
          )
        }
        onClick={onLeaveGroup}
        hidden={!canLeaveGroup}
        disabled={isJoiningOrLeavingGroup}
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

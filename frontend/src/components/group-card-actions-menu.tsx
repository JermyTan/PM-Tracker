import { useState } from "react";
import { Menu, ActionIcon, Text, Modal, Loader } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { FaChevronDown, FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdLogout, MdPersonAdd, MdPeopleAlt } from "react-icons/md";
import { NAME } from "../constants";
import {
  useDeleteCourseGroupMutation,
  useJoinOrLeaveCourseGroupMutation,
  useRenameCourseGroupMutation,
} from "../redux/services/groups-api";
import { CourseData } from "../types/courses";
import { GroupPatchAction, GroupData } from "../types/groups";
import toastUtils from "../utils/toast-utils";
import GroupDeleteOption from "./group-delete-option";
import GroupNameForm, { GroupNameData } from "./group-name-form";
import GroupJoinOrLeaveConfirmation from "./group-join-or-leave-confirmation";
import { useResolveError } from "../utils/error-utils";

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
    useJoinOrLeaveCourseGroupMutation();

  const [renameGroup] = useRenameCourseGroupMutation();

  const modals = useModals();
  const courseId = course?.id;
  const groupId = group?.id;

  const resolveError = useResolveError();

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

    const actionPastTense =
      action === GroupPatchAction.Join ? "joined" : "left";

    try {
      await joinOrLeaveGroup({ ...groupPutData, courseId, groupId }).unwrap();

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

  const shouldShowWarningModalOnJoin =
    !hasAdminPermission && !course?.allowStudentsToLeaveGroups;

  const onJoinGroup = () => {
    if (shouldShowWarningModalOnJoin) {
      openJoinGroupModal();
      return;
    }

    onJoinOrLeaveGroup(GroupPatchAction.Join);
  };

  const shouldShowWarningModalOnLeave =
    !hasAdminPermission && !course?.allowStudentsToJoinGroups;

  const onLeaveGroup = () => {
    if (shouldShowWarningModalOnLeave) {
      openJoinGroupModal();
      return;
    }

    onJoinOrLeaveGroup(GroupPatchAction.Leave);
  };

  // const openJoinGroupModal = () =>
  //   modals.openConfirmModal({
  //     title: "Join group",
  //     closeButtonLabel: "Cancel joining group",
  //     centered: true,
  //     children: (
  //       <Text size="sm">
  //         Are you sure you want to join this group?
  //         {!hasAdminPermission && !course?.allowStudentsToLeaveGroups && (
  //           <div>
  //             <br />
  //             <strong>Once you join a group, you cannot leave.</strong>
  //           </div>
  //         )}
  //       </Text>
  //     ),
  //     labels: { confirm: "Join group", cancel: "Cancel" },
  //     confirmProps: { color: "green", loading: isJoiningOrLeavingGroup },
  //     onConfirm: () => {
  //       onJoinOrLeaveGroup(GroupPatchAction.Join);
  //     },
  //   });

  // const openLeaveGroupModal = () =>
  //   modals.openConfirmModal({
  //     title: "Leave group",
  //     closeButtonLabel: "Cancel leaving group",
  //     centered: true,
  //     children: (
  //       <Text size="sm">
  //         Are you sure you want to leave this group?
  //         {!hasAdminPermission && !course?.allowStudentsToJoinGroups && (
  //           <div>
  //             <br />
  //             <strong>Once you leave a group, you cannot join it again.</strong>
  //           </div>
  //         )}
  //       </Text>
  //     ),
  //     labels: { confirm: "Leave group", cancel: "Cancel" },
  //     confirmProps: { color: "red", loading: isJoiningOrLeavingGroup },
  //     onConfirm: () => {
  //       onJoinOrLeaveGroup(GroupPatchAction.Leave);
  //     },
  //   });

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
            // TODO: Remove onSuccess and try to refactor
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
      closeOnItemClick={false}
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
      <Menu.Item icon={<MdPeopleAlt size={14} />} hidden={!canEditMembers}>
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
      {/* <GroupDeleteOption
        hidden={!canDeleteGroup}
        course={course}
        group={group}
      /> */}
    </Menu>
  );
}

export default GroupCardActionsMenu;

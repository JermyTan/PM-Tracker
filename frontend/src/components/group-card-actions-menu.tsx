import { zodResolver } from "@hookform/resolvers/zod";
import { Menu, ActionIcon, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaChevronDown, FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdLogout, MdPersonAdd, MdPeopleAlt } from "react-icons/md";
import { z } from "zod";
import { NAME } from "../constants";

import {
  useDeleteCourseGroupMutation,
  useJoinOrLeaveCourseGroupMutation,
  useRenameCourseGroupMutation,
} from "../redux/services/groups-api";
import { CourseData } from "../types/courses";
import { GroupPatchAction, GroupSummaryView } from "../types/groups";
import { useResolveError } from "../utils/error-utils";
import { handleSubmitForm } from "../utils/form-utils";
import toastUtils from "../utils/toast-utils";
import TextField from "./text-field";

type Props = {
  course?: CourseData;
  courseId?: number | string;
  group?: GroupSummaryView;
  hasAdminPermission?: boolean;
  userIsInGroup?: boolean;
};

type OptionProps = {
  hidden: boolean;
  courseId?: number | string;
  group?: GroupSummaryView;
};

const schema = z.object({
  [NAME]: z.string().trim().min(1, "Please enter a group name"),
});

type CourseGroupRenameProps = z.infer<typeof schema>;

function RenameGroupOption({ hidden, group, courseId }: OptionProps) {
  const modals = useModals();
  const [renameGroup, { isLoading }] = useRenameCourseGroupMutation();

  const methods = useForm<CourseGroupRenameProps>({
    resolver: zodResolver(schema),
    defaultValues: { [NAME]: `${group ? group?.name : ""}` },
  });
  const { resolveError } = useResolveError({ name: "group-card-actions-menu" });
  const renameFormRef = useRef<HTMLFormElement>(null);

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  console.log("error", errors[NAME]);

  const onRenameCourseGroup = async (formData: CourseGroupRenameProps) => {
    console.log("start of call");
    if (
      courseId === undefined ||
      group?.id === undefined ||
      isLoading ||
      isSubmitting
    ) {
      return;
    }

    console.log("make call");
    const groupId = group?.id;

    const renameData = {
      action: GroupPatchAction.Modify,
      payload: {
        name: formData[NAME],
      },
    };

    await renameGroup({ ...renameData, courseId, groupId }).unwrap();
  };

  const openRenameGroupModal = () =>
    modals.openConfirmModal({
      title: "Rename group",
      closeButtonLabel: "Cancel renaming group",
      centered: true,
      closeOnConfirm: false,
      children: (
        <FormProvider {...methods}>
          <form
            autoComplete="off"
            ref={renameFormRef}
            onSubmit={handleSubmitForm(
              handleSubmit(onRenameCourseGroup),
              resolveError,
            )}
          >
            <TextField name={NAME} required />
          </form>
        </FormProvider>
      ),
      labels: { confirm: "Save changes", cancel: "Cancel" },
      confirmProps: { color: "green", loading: isLoading },
      onConfirm: () => {
        const form = renameFormRef.current;
        console.log(form);
        if (!form) {
          return;
        }

        console.log("hello");
        console.log(form.checkValidity());
        console.log(form.reportValidity());
        form.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true }),
        );
      },
    });

  return (
    <Menu.Item
      icon={<FaEdit size={14} />}
      hidden={hidden}
      onClick={openRenameGroupModal}
    >
      Rename group
    </Menu.Item>
  );
}

function GroupCardActionsMenu({
  course,
  courseId,
  group,
  hasAdminPermission,
  userIsInGroup,
}: Props) {
  const [joinOrLeaveGroup, { isLoading: isJoiningOrLeavingGroup }] =
    useJoinOrLeaveCourseGroupMutation();
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
      group?.id === undefined
    ) {
      return;
    }

    const groupId = group?.id;

    const groupPutData = {
      action,
      payload: {
        userId: null,
      },
    };
    await joinOrLeaveGroup({ ...groupPutData, courseId, groupId }).unwrap();

    // TODO: update message for diff actions and handle error cases
    toastUtils.success({
      message: `The group has been updated successfully.`,
    });
    // onSuccess?.();
  };

  const onDeleteCourseGroup = async () => {
    if (courseId === undefined || group?.id === undefined || isDeletingGroup) {
      return;
    }
    const groupId = group?.id;

    await deleteGroup({ courseId, groupId }).unwrap();

    toastUtils.success({
      message: `The group has been successfully deleted.`,
    });
  };

  // TODO: refactor these openModal commands?

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
      <RenameGroupOption
        hidden={!canModifyGroupName}
        courseId={courseId}
        group={group}
      />
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
        hidden={canLeaveGroup}
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

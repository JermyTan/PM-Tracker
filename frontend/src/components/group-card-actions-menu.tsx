import { Menu, ActionIcon } from "@mantine/core";
import { FaChevronDown, FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdLogout, MdPersonAdd } from "react-icons/md";
import {
  useDeleteCourseGroupMutation,
  useUpdateCourseGroupMutation,
} from "../redux/services/groups-api";
import { GroupPatchAction } from "../types/groups";
import toastUtils from "../utils/toast-utils";

type Props = {
  canJoinGroup?: boolean;
  canEditMembers?: boolean;
  canLeaveGroup?: boolean;
  canDeleteGroup?: boolean;
  courseId?: number | string;
  groupId?: number;
};

function GroupCardActionsMenu({
  canJoinGroup,
  canEditMembers,
  canLeaveGroup,
  canDeleteGroup,
  courseId,
  groupId,
}: Props) {
  const [updateGroup] = useUpdateCourseGroupMutation();
  const [deleteGroup] = useDeleteCourseGroupMutation();

  const onJoinOrLeaveGroup = async (
    action: GroupPatchAction,
    userId: number | null,
  ) => {
    if (courseId === undefined || groupId === undefined) {
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
      message: "The group has been updated successfully.",
    });
    // onSuccess?.();
  };

  const onDeleteCourseGroup = async () => {
    if (courseId === undefined || groupId === undefined) {
      return;
    }

    await deleteGroup({ courseId, groupId }).unwrap();

    toastUtils.success({
      message: "The group has been successfully deleted.",
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
    >
      {canJoinGroup && (
        <Menu.Item
          icon={<MdPersonAdd size={14} />}
          onClick={() => {
            onJoinOrLeaveGroup(GroupPatchAction.Join, null);
          }}
        >
          Join group
        </Menu.Item>
      )}
      {canEditMembers && (
        <Menu.Item icon={<FaEdit size={14} />}>Edit members</Menu.Item>
      )}
      {canLeaveGroup && (
        <Menu.Item
          icon={<MdLogout size={14} />}
          onClick={() => {
            onJoinOrLeaveGroup(GroupPatchAction.Leave, null);
          }}
        >
          Leave group
        </Menu.Item>
      )}
      {canDeleteGroup && (
        <Menu.Item
          icon={<FaTrashAlt size={14} color="red" />}
          onClick={onDeleteCourseGroup}
        >
          Delete group
        </Menu.Item>
      )}
    </Menu>
  );
}

export default GroupCardActionsMenu;

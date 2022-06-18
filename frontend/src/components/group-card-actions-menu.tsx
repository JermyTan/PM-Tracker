import { Menu, ActionIcon } from "@mantine/core";
import { FaChevronDown, FaEdit, FaTrashAlt } from "react-icons/fa";
import { MdGroup, MdLogout, MdPersonAdd } from "react-icons/md";
import { useUpdateCourseGroupMutation } from "../redux/services/groups-api";
import toastUtils from "../utils/toast-utils";

type Props = {
  canJoinGroup?: boolean;
  canEditMembers?: boolean;
  canLeaveGroup?: boolean;
  canDeleteMembers?: boolean;
  courseId?: number | string;
  groupId?: number;
};

function GroupCardActionsMenu({
  canJoinGroup,
  canEditMembers,
  canLeaveGroup,
  canDeleteMembers,
  courseId,
  groupId,
}: Props) {
  const [updateGroup] = useUpdateCourseGroupMutation();

  const handleUpdateGroup = async (action: string, userId: number | null) => {
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

    toastUtils.success({
      message: "This group has been updated successfully.",
    });
    // onSuccess?.();
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
            console.log("JOIN GROUP");
            handleUpdateGroup("JOIN", null);
          }}
        >
          Join group
        </Menu.Item>
      )}
      {canEditMembers && (
        <Menu.Item icon={<FaEdit size={14} />}>Edit members</Menu.Item>
      )}
      {canLeaveGroup && (
        <Menu.Item icon={<MdLogout size={14} />}>Leave group</Menu.Item>
      )}
      {canDeleteMembers && (
        <Menu.Item icon={<FaTrashAlt size={14} color="red" />}>
          Delete group
        </Menu.Item>
      )}
    </Menu>
  );
}

export default GroupCardActionsMenu;

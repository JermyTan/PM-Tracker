import { ActionIcon, Group, Menu, Modal } from "@mantine/core";
import { useState } from "react";
import { FaEdit, FaTrashAlt, FaUserEdit } from "react-icons/fa";
import { CourseMemberData } from "../types/courses";
import CourseMemberEditRoleMenu from "./course-member-edit-role-menu";
import CourseMemberRemoveConfirmation from "./course-member-remove-confirmation";

import UserProfileDisplay from "./user-profile-display";

type Props = {
  member: CourseMemberData;
  makeAdminOptionsAvailable: boolean;
};

function CourseMemberDisplay({ member, makeAdminOptionsAvailable }: Props) {
  const [isRemoveMemberModalOpen, setRemoveMemberModalOpen] = useState(false);
  const [isEditMemberRoleModalOpen, setEditMemberRoleModalOpen] =
    useState(false);
  useState(false);

  return (
    <>
      <Modal
        title="Remove member from course"
        opened={isRemoveMemberModalOpen}
        onClose={() => setRemoveMemberModalOpen(false)}
        centered
      >
        <CourseMemberRemoveConfirmation
          member={member}
          onSuccess={() => setRemoveMemberModalOpen(false)}
        />
      </Modal>

      <Modal
        title="Edit member's role in course"
        opened={isEditMemberRoleModalOpen}
        onClose={() => setEditMemberRoleModalOpen(false)}
        centered
      >
        <CourseMemberEditRoleMenu
          member={member}
          onSuccess={() => setEditMemberRoleModalOpen(false)}
        />
      </Modal>

      <Group position="apart">
        <UserProfileDisplay user={member.user} />
        {makeAdminOptionsAvailable && (
          <Menu position="bottom-end" transition="pop-bottom-right">
            <Menu.Target>
              <ActionIcon>
                <FaEdit />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item
                icon={<FaUserEdit />}
                onClick={() => setEditMemberRoleModalOpen(true)}
              >
                Edit role
              </Menu.Item>
              <Menu.Item
                icon={<FaTrashAlt color="red" />}
                onClick={() => setRemoveMemberModalOpen(true)}
              >
                Remove from course
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        )}
      </Group>
    </>
  );
}

export default CourseMemberDisplay;

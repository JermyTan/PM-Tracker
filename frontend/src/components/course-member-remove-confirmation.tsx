import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  Space,
  Text,
} from "@mantine/core";
import { useState } from "react";
import { FaEdit, FaTrashAlt, FaUserEdit } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { useDeleteCourseMembershipMutation } from "../redux/services/members-api";
import { CourseMemberData } from "../types/courses";
import { useResolveError } from "../utils/error-utils";
import toastUtils from "../utils/toast-utils";

import UserProfileDisplay from "./user-profile-display";

type Props = {
  member: CourseMemberData;
  onSuccess?: () => void;
};

function CourseMemberRemoveConfirmation({ member, onSuccess }: Props) {
  const { courseId } = useParams();
  const membershipId = member.id;

  const resolveError = useResolveError();

  const [deleteCourseMember, { isLoading }] =
    useDeleteCourseMembershipMutation();

  const onDeleteCourseMember = async () => {
    if (isLoading || courseId === undefined) {
      return;
    }

    try {
      await deleteCourseMember({
        courseId,
        membershipId,
      }).unwrap();

      toastUtils.success({
        message: "The course has been successfully deleted.",
      });

      onSuccess?.();
    } catch (error) {
      resolveError(error);
    }
  };

  return (
    <>
      <Text size="sm">
        Are you sure you want to remove this member from the course?
        <br />
        <strong>This action is irreversible.</strong>
      </Text>
      <Space h="md" />
      <UserProfileDisplay {...member.user} />
      <Space h="md" />
      <Group position="right">
        <Button color="gray" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          color="red"
          disabled={isLoading}
          loading={isLoading}
          onClick={onDeleteCourseMember}
        >
          Remove member
        </Button>
      </Group>
    </>
  );
}

export default CourseMemberRemoveConfirmation;

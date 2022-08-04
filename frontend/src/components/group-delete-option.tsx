import { Menu, Text, Modal, Button, Space, Group } from "@mantine/core";
import { useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { useDeleteCourseGroupMutation } from "../redux/services/groups-api";
import { CourseData } from "../types/courses";
import { GroupData } from "../types/groups";
import { useResolveError } from "../utils/error-utils";
import toastUtils from "../utils/toast-utils";

type Props = {
  course?: CourseData;
  group?: GroupData;
  onSuccess?: () => void;
};

function GroupDeleteOption({ course, group, onSuccess }: Props) {
  const [deleteGroup, { isLoading }] = useDeleteCourseGroupMutation();

  const courseId = course?.id;
  const groupId = group?.id;

  const { resolveError } = useResolveError();

  const onDeleteCourseGroup = async () => {
    if (courseId === undefined || groupId === undefined || isLoading) {
      return;
    }

    try {
      await deleteGroup({ courseId, groupId }).unwrap();

      toastUtils.success({
        message: `The group${
          group ? ` "${group.name}"` : ""
        } has been successfully deleted.`,
      });

      onSuccess?.();
    } catch (error) {
      resolveError(error);
    }
  };

  return (
    <>
      <Text size="sm">
        Are you sure you want to delete the group
        {group ? ` "${group.name}"` : ""}?
        <br />
        <strong>This action is irreversible.</strong>
      </Text>
      <Space h="md" />
      <Group position="right">
        <Button color="gray" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          color="red"
          onClick={onDeleteCourseGroup}
          loading={isLoading}
          disabled={isLoading}
        >
          Delete group
        </Button>
      </Group>
    </>
  );
}

export default GroupDeleteOption;

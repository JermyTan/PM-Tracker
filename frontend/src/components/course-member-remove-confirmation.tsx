import {
  ActionIcon,
  Button,
  Group,
  Menu,
  Modal,
  Space,
  Text,
} from "@mantine/core";
import { useDeleteCourseMembershipMutation } from "../redux/services/members-api";
import { CourseMemberData } from "../types/courses";
import { useResolveError } from "../utils/error-utils";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import toastUtils from "../utils/toast-utils";

import UserProfileDisplay from "./user-profile-display";

type Props = {
  member: CourseMemberData;
  onSuccess?: () => void;
};

function CourseMemberRemoveConfirmation({ member, onSuccess }: Props) {
  const courseId = useGetCourseId();
  const membershipId = member.id;

  const { resolveError } = useResolveError();

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
        message: "The member has been successfully removed from the course.",
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

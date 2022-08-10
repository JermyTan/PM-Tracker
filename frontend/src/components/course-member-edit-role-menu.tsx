import { Button, Group, Radio, RadioGroup, Space } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { capitalCase } from "change-case";
import { useState } from "react";
import { ROLE } from "../constants";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import { useGetSingleCourseQuery } from "../redux/services/courses-api";
import { useUpdateCourseMembershipMutation } from "../redux/services/members-api";
import {
  CourseMemberData,
  editableRoleMap,
  Role,
  ALL_ROLES,
} from "../types/courses";
import { useResolveError } from "../utils/error-utils";
import toastUtils from "../utils/toast-utils";

type Props = {
  member: CourseMemberData;
  onSuccess?: () => void;
};

function CourseMemberEditRoleMenu({ member, onSuccess }: Props) {
  const [memberRole, setMemberRole] = useState(member.role);

  const courseId = useGetCourseId();
  const { course } = useGetSingleCourseQuery(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({ course }),
  });
  const editableRoles = editableRoleMap.get(course?.role) || new Set<Role>();

  const membershipId = member.id;

  const { resolveError } = useResolveError();

  const [updateCourseMemberRole, { isLoading }] =
    useUpdateCourseMembershipMutation();

  const onUpdateCourseMemberRole = async () => {
    if (isLoading || courseId === undefined) {
      return;
    }

    const updateCourseMembershipData = {
      [ROLE]: memberRole,
    };

    try {
      await updateCourseMemberRole({
        courseId,
        membershipId,
        ...updateCourseMembershipData,
      }).unwrap();

      toastUtils.success({
        message: "The member's role has been successfully updated.",
      });

      onSuccess?.();
    } catch (error) {
      resolveError(error);
    }
  };

  return (
    <>
      <RadioGroup
        value={memberRole}
        onChange={(value: string) => {
          try {
            const selectedRole = value as Role;
            setMemberRole(selectedRole);
          } catch {
            setMemberRole(memberRole);
          }
        }}
      >
        {ALL_ROLES.map((role) => (
          <Radio
            value={role}
            label={capitalCase(role)}
            disabled={!editableRoles.has(role)}
          />
        ))}
      </RadioGroup>
      <Space h="md" />
      <Group position="right">
        <Button color="gray" onClick={onSuccess}>
          Cancel
        </Button>
        <Button
          disabled={isLoading}
          loading={isLoading}
          onClick={onUpdateCourseMemberRole}
        >
          Save changes
        </Button>
      </Group>
    </>
  );
}

export default CourseMemberEditRoleMenu;

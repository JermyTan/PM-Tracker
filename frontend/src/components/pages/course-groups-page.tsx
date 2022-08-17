import { skipToken } from "@reduxjs/toolkit/query/react";
import {
  Text,
  Stack,
  Space,
  SimpleGrid,
  Button,
  Group,
  Modal,
  ScrollArea,
} from "@mantine/core";
import { MdAdd } from "react-icons/md";
import { useState } from "react";
import { useGetSingleCourseQuery } from "../../redux/services/courses-api";
import {
  useCreateCourseGroupMutation,
  useGetCourseGroupsQuery,
} from "../../redux/services/groups-api";
import PlaceholderWrapper from "../placeholder-wrapper";
import GroupCard from "../group-card";
import CourseMembershipsList from "../course-memberships-list";
import GroupNameForm, { GroupNameData } from "../group-name-form";
import toastUtils from "../../utils/toast-utils";
import { Role } from "../../types/courses";
import useGetCourseId from "../../custom-hooks/use-get-course-id";

function CourseGroupPage() {
  const [isCreateGroupModalOpen, setCreateGroupModalOpen] = useState(false);
  const [createGroup] = useCreateCourseGroupMutation();
  const courseId = useGetCourseId();

  const { data: groups, isLoading } = useGetCourseGroupsQuery(
    courseId === undefined ? skipToken : { courseId },
  );

  const { course } = useGetSingleCourseQuery(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({ course }),
  });

  const hasAdminPermission = course?.role !== Role.Student;

  const userCanCreateGroup =
    hasAdminPermission || course?.allowStudentsToCreateGroups;

  const openCreateGroupModal = () => {
    setCreateGroupModalOpen(true);
  };

  const handleCreateGroupRequest = async (parsedData: GroupNameData) => {
    const courseId = course?.id;
    if (courseId === undefined) {
      return;
    }

    await createGroup({ ...parsedData, courseId }).unwrap();

    toastUtils.success({ message: "Succesfully created group." });
    setCreateGroupModalOpen(false);
  };

  return (
    <>
      <Modal
        centered
        title="Create a New Group"
        opened={isCreateGroupModalOpen}
        onClose={() => {
          setCreateGroupModalOpen(false);
        }}
      >
        <GroupNameForm
          defaultValue=""
          onSubmit={handleCreateGroupRequest}
          confirmButtonName="Create new group"
        />
      </Modal>
      <SimpleGrid cols={2} spacing="lg">
        <div>
          <Group position="apart">
            <Text weight={700} size="lg">
              My Groups
            </Text>
            <Button
              hidden={!userCanCreateGroup}
              leftIcon={<MdAdd />}
              onClick={openCreateGroupModal}
            >
              Create group
            </Button>
          </Group>
          <Space h="md" />
          <PlaceholderWrapper
            py={150}
            isLoading={isLoading}
            loadingMessage="Loading courses..."
            defaultMessage="No courses found."
            showDefaultMessage={!isLoading && (!groups || groups?.length === 0)}
          >
            <Stack spacing="xs">
              {groups?.map((group) => (
                <GroupCard groupId={group.id} key={group.id} course={course} />
              ))}
            </Stack>
          </PlaceholderWrapper>
        </div>

        <CourseMembershipsList
          courseId={courseId}
          hasAdminPermission={hasAdminPermission}
        />
      </SimpleGrid>
    </>
  );
}

export default CourseGroupPage;

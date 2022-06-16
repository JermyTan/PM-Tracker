import {
  Group,
  Indicator,
  Paper,
  Select,
  Stack,
  Switch,
  Text,
  Textarea,
  TextInput,
  Tooltip,
} from "@mantine/core";
import { FaQuestion } from "react-icons/fa";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useParams } from "react-router-dom";
import {
  ALLOW_STUDENTS_TO_ADD_OR_REMOVE_GROUP_MEMBERS,
  ALLOW_STUDENTS_TO_CREATE_GROUPS,
  ALLOW_STUDENTS_TO_DELETE_GROUPS,
  ALLOW_STUDENTS_TO_JOIN_GROUPS,
  ALLOW_STUDENTS_TO_LEAVE_GROUPS,
  ALLOW_STUDENTS_TO_MODIFY_GROUP_NAME,
  IS_PUBLISHED,
  SHOW_GROUP_MEMBERS_NAMES,
} from "../../constants";
import { useGetSingleCourseQuery } from "../../redux/services/courses-api";
import CourseCreationForm from "../course-creation-form";

function CourseDetailsPage() {
  const { courseId } = useParams();
  const { data: course } = useGetSingleCourseQuery(courseId ?? skipToken);
  const {
    name,
    owner,
    description,
    milestoneAlias,
    isPublished,
    showGroupMembersNames,
    allowStudentsToModifyGroupName,
    allowStudentsToCreateGroups,
    allowStudentsToDeleteGroups,
    allowStudentsToJoinGroups,
    allowStudentsToLeaveGroups,
    allowStudentsToAddOrRemoveGroupMembers,
  } = course ?? {};

  return (
    <Paper withBorder shadow="sm" p="md" radius="md">
      <CourseCreationForm />
      {/* <Stack>
        <Select
          label="Course Owner"
          description="Only the course owner can update this field."
          data={["jeremy", "cynthia"]}
        />

        <TextInput label="Course Name" value={name} readOnly />

        <Textarea
          label="Course Description"
          value={description}
          readOnly
          autosize
          minRows={3}
        />

        <TextInput
          label="Milestone Alias"
          description="Another name for milestone. This alias will be displayed in place of 'milestone'."
          placeholder="E.g. iteration"
          value={milestoneAlias}
          readOnly
        />

        <Group spacing="lg" position="apart">
          <Indicator
            size={18}
            color="gray"
            offset={-2}
            label={
              <Tooltip
                label={
                  <Text size="xs">
                    Students can view and access this course via{" "}
                    <strong>My Courses</strong>.
                  </Text>
                }
                withArrow
                placement="start"
                transition="pop-top-left"
                transitionDuration={300}
                wrapLines
                width={260}
              >
                <FaQuestion size={8} />
              </Tooltip>
            }
          >
            <Text<"label"> size="sm" htmlFor={IS_PUBLISHED} component="label">
              Publish Course
            </Text>
          </Indicator>
          <Switch
            id={IS_PUBLISHED}
            checked={isPublished}
            onLabel="Yes"
            offLabel="No"
            size="md"
          />
        </Group>

        <Text size="lg" weight={500}>
          Group Settings
        </Text>

        <Group spacing="lg" position="apart">
          <Indicator
            size={18}
            color="gray"
            offset={-2}
            label={
              <Tooltip
                label={
                  <Text size="xs">
                    Students can view the group members in other groups.
                  </Text>
                }
                withArrow
                placement="start"
                transition="pop-top-left"
                transitionDuration={300}
                wrapLines
                width={260}
              >
                <FaQuestion size={8} />
              </Tooltip>
            }
          >
            <Text<"label">
              size="sm"
              htmlFor={SHOW_GROUP_MEMBERS_NAMES}
              component="label"
            >
              Make group members public
            </Text>
          </Indicator>
          <Switch
            id={SHOW_GROUP_MEMBERS_NAMES}
            checked={showGroupMembersNames}
            onLabel="Yes"
            offLabel="No"
            size="md"
          />
        </Group>

        <Group spacing="lg" position="apart">
          <Indicator
            size={18}
            color="gray"
            offset={-2}
            label={
              <Tooltip
                label={
                  <Text size="xs">
                    Students can change the names of the groups they are in.
                  </Text>
                }
                withArrow
                placement="start"
                transition="pop-top-left"
                transitionDuration={300}
                wrapLines
                width={260}
              >
                <FaQuestion size={8} />
              </Tooltip>
            }
          >
            <Text<"label">
              size="sm"
              htmlFor={ALLOW_STUDENTS_TO_MODIFY_GROUP_NAME}
              component="label"
            >
              Students can modify group names
            </Text>
          </Indicator>
          <Switch
            id={ALLOW_STUDENTS_TO_MODIFY_GROUP_NAME}
            checked={allowStudentsToModifyGroupName}
            onLabel="Yes"
            offLabel="No"
            size="md"
          />
        </Group>

        <Group spacing="lg" position="apart">
          <Text<"label">
            size="sm"
            htmlFor={ALLOW_STUDENTS_TO_CREATE_GROUPS}
            component="label"
          >
            Students can create groups
          </Text>
          <Switch
            id={ALLOW_STUDENTS_TO_CREATE_GROUPS}
            checked={allowStudentsToCreateGroups}
            onLabel="Yes"
            offLabel="No"
            size="md"
          />
        </Group>

        <Group spacing="lg" position="apart">
          <Indicator
            size={18}
            color="gray"
            offset={-2}
            label={
              <Tooltip
                label={
                  <Text size="xs">
                    Students can disband groups for which they are in.
                  </Text>
                }
                withArrow
                placement="start"
                transition="pop-top-left"
                transitionDuration={300}
                wrapLines
                width={260}
              >
                <FaQuestion size={8} />
              </Tooltip>
            }
          >
            <Text<"label">
              size="sm"
              htmlFor={ALLOW_STUDENTS_TO_DELETE_GROUPS}
              component="label"
            >
              Students can delete groups
            </Text>
          </Indicator>
          <Switch
            id={ALLOW_STUDENTS_TO_DELETE_GROUPS}
            checked={allowStudentsToDeleteGroups}
            onLabel="Yes"
            offLabel="No"
            size="md"
          />
        </Group>

        <Group spacing="lg" position="apart">
          <Text<"label">
            size="sm"
            htmlFor={ALLOW_STUDENTS_TO_JOIN_GROUPS}
            component="label"
          >
            Students can join groups
          </Text>
          <Switch
            id={ALLOW_STUDENTS_TO_JOIN_GROUPS}
            checked={allowStudentsToJoinGroups}
            onLabel="Yes"
            offLabel="No"
            size="md"
          />
        </Group>

        <Group spacing="lg" position="apart">
          <Text<"label">
            size="sm"
            htmlFor={ALLOW_STUDENTS_TO_LEAVE_GROUPS}
            component="label"
          >
            Students can leave groups
          </Text>
          <Switch
            id={ALLOW_STUDENTS_TO_LEAVE_GROUPS}
            checked={allowStudentsToLeaveGroups}
            onLabel="Yes"
            offLabel="No"
            size="md"
          />
        </Group>

        <Group spacing="lg" position="apart">
          <Indicator
            size={18}
            color="gray"
            offset={-2}
            label={
              <Tooltip
                label={
                  <Text size="xs">
                    Students can add/remove group members for groups they are
                    in.
                  </Text>
                }
                withArrow
                placement="start"
                transition="pop-top-left"
                transitionDuration={300}
                wrapLines
                width={260}
              >
                <FaQuestion size={8} />
              </Tooltip>
            }
          >
            <Text<"label">
              size="sm"
              htmlFor={ALLOW_STUDENTS_TO_ADD_OR_REMOVE_GROUP_MEMBERS}
              component="label"
            >
              Students can add/remove group members
            </Text>
          </Indicator>
          <Switch
            id={ALLOW_STUDENTS_TO_ADD_OR_REMOVE_GROUP_MEMBERS}
            checked={allowStudentsToAddOrRemoveGroupMembers}
            onLabel="Yes"
            offLabel="No"
            size="md"
          />
        </Group>
      </Stack> */}
    </Paper>
  );
}

export default CourseDetailsPage;

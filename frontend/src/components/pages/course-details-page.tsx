import {
  Anchor,
  Avatar,
  createStyles,
  Group,
  Paper,
  Spoiler,
  Stack,
  Text,
  ThemeIcon,
  Title,
  Tooltip,
} from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { FaQuestion } from "react-icons/fa";
import { useGetSingleCourseQuery } from "../../redux/services/courses-api";
import CourseActionsSection from "../course-actions-section";
import RoleRestrictedWrapper from "../role-restricted-wrapper";
import { Role } from "../../types/courses";
import { useGetCourseId } from "../../custom-hooks/use-get-course-id";

const useStyles = createStyles({
  detailsSection: {
    flex: "1 1 auto",
    whiteSpace: "break-spaces",
  },
  actionsSection: {
    width: "250px",
    flex: "1 0 auto",
  },
});

function CourseDetailsPage() {
  const courseId = useGetCourseId();
  const { course } = useGetSingleCourseQuery(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({ course }),
  });
  const { classes } = useStyles();

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
    <Group align="start" noWrap>
      <Paper
        className={classes.detailsSection}
        withBorder
        shadow="sm"
        p="md"
        radius="md"
      >
        <Stack spacing={36}>
          <Stack spacing="xs">
            <Title order={4}>Course owner</Title>
            <Group spacing="xl">
              <Avatar
                size={70}
                radius={70}
                alt=""
                src={owner?.profileImage || undefined}
              />
              <div>
                <Text weight={500}>{owner?.name}</Text>
                {owner?.email && (
                  <Anchor href={`mailto:${owner.email}`}>{owner.email}</Anchor>
                )}
              </div>
            </Group>
          </Stack>

          <Stack spacing="xs">
            <Title order={4}>Course name</Title>
            <Text>{name}</Text>
          </Stack>

          <Stack spacing="xs">
            <Title order={4}>Course description</Title>
            <Spoiler maxHeight={150} showLabel="Show more" hideLabel="Hide">
              <Text color={!description ? "dimmed" : undefined}>
                {description || "No description"}
              </Text>
            </Spoiler>
          </Stack>

          <RoleRestrictedWrapper allowedRoles={[Role.CoOwner, Role.Instructor]}>
            <Stack spacing="xs">
              <Group spacing={4}>
                <Title order={4}>Milestone alias</Title>
                <Tooltip
                  label={
                    <Text size="xs">
                      Another name for milestone. This alias will be displayed
                      in place of &apos;milestone&apos;.
                    </Text>
                  }
                  withArrow
                  placement="start"
                  transition="pop-top-left"
                  transitionDuration={300}
                  wrapLines
                  width={300}
                >
                  <ThemeIcon color="gray" size="sm" radius="xl">
                    <FaQuestion size={10} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
              <Text color={!milestoneAlias ? "dimmed" : undefined}>
                {milestoneAlias || "No alias"}
              </Text>
            </Stack>

            <Stack spacing="xs">
              <Group spacing={4}>
                <Title order={4}>Publish course</Title>
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
                  width={300}
                >
                  <ThemeIcon color="gray" size="sm" radius="xl">
                    <FaQuestion size={10} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
              <Text weight={500} color={isPublished ? "green" : "red"}>
                {isPublished ? "Yes" : "No"}
              </Text>
            </Stack>

            <Stack spacing="xs">
              <Group spacing={4}>
                <Title order={4}>Make group members public</Title>
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
                  width={300}
                >
                  <ThemeIcon color="gray" size="sm" radius="xl">
                    <FaQuestion size={10} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
              <Text
                weight={500}
                color={showGroupMembersNames ? "green" : "red"}
              >
                {showGroupMembersNames ? "Yes" : "No"}
              </Text>
            </Stack>

            <Stack spacing="xs">
              <Group spacing={4}>
                <Title order={4}>Students can modify group names</Title>
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
                  width={300}
                >
                  <ThemeIcon color="gray" size="sm" radius="xl">
                    <FaQuestion size={10} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
              <Text
                weight={500}
                color={allowStudentsToModifyGroupName ? "green" : "red"}
              >
                {allowStudentsToModifyGroupName ? "Yes" : "No"}
              </Text>
            </Stack>

            <Stack spacing="xs">
              <Title order={4}>Students can create groups</Title>
              <Text
                weight={500}
                color={allowStudentsToCreateGroups ? "green" : "red"}
              >
                {allowStudentsToCreateGroups ? "Yes" : "No"}
              </Text>
            </Stack>

            <Stack spacing="xs">
              <Group spacing={4}>
                <Title order={4}>Students can delete groups</Title>
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
                  width={300}
                >
                  <ThemeIcon color="gray" size="sm" radius="xl">
                    <FaQuestion size={10} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
              <Text
                weight={500}
                color={allowStudentsToDeleteGroups ? "green" : "red"}
              >
                {allowStudentsToDeleteGroups ? "Yes" : "No"}
              </Text>
            </Stack>

            <Stack spacing="xs">
              <Title order={4}>Students can join groups</Title>
              <Text
                weight={500}
                color={allowStudentsToJoinGroups ? "green" : "red"}
              >
                {allowStudentsToJoinGroups ? "Yes" : "No"}
              </Text>
            </Stack>

            <Stack spacing="xs">
              <Title order={4}>Students can leave groups</Title>
              <Text
                weight={500}
                color={allowStudentsToLeaveGroups ? "green" : "red"}
              >
                {allowStudentsToLeaveGroups ? "Yes" : "No"}
              </Text>
            </Stack>

            <Stack spacing="xs">
              <Group spacing={4}>
                <Title order={4}>Students can add/remove group members</Title>
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
                  width={300}
                >
                  <ThemeIcon color="gray" size="sm" radius="xl">
                    <FaQuestion size={10} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
              <Text
                weight={500}
                color={allowStudentsToAddOrRemoveGroupMembers ? "green" : "red"}
              >
                {allowStudentsToAddOrRemoveGroupMembers ? "Yes" : "No"}
              </Text>
            </Stack>
          </RoleRestrictedWrapper>
        </Stack>
      </Paper>

      <RoleRestrictedWrapper allowedRoles={[Role.CoOwner]}>
        <Paper
          className={classes.actionsSection}
          withBorder
          shadow="sm"
          p="md"
          radius="md"
        >
          <CourseActionsSection />
        </Paper>
      </RoleRestrictedWrapper>
    </Group>
  );
}

export default CourseDetailsPage;

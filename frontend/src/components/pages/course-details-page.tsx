import {
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
import ConditionalRenderer from "../conditional-renderer";
import useGetCourseId from "../../custom-hooks/use-get-course-id";
import TextViewer from "../text-viewer";
import useGetCoursePermissions from "../../custom-hooks/use-get-course-permissions";
import UserProfileDisplay from "../user-profile-display";

const useStyles = createStyles((theme) => ({
  detailsSection: {
    flex: "1 1 auto",
  },
  actionsSection: {
    width: "250px",
    flex: "1 0 auto",
  },
  spoilerControl: {
    fontSize: theme.fontSizes.sm,
  },
}));

function CourseDetailsPage() {
  const courseId = useGetCourseId();
  const { course } = useGetSingleCourseQuery(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({ course }),
  });
  const { classes } = useStyles();
  const { canAccessFullDetails, canModify, canDelete } =
    useGetCoursePermissions();

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
        <Stack spacing={32}>
          <Stack spacing="xs">
            <Title order={5}>Course owner</Title>
            {owner && (
              <UserProfileDisplay
                user={owner}
                avatarProps={{ size: 60, radius: 60 }}
                spacing="xl"
                nameProps={{ size: "md" }}
                emailProps={{ size: "sm", color: undefined }}
              />
            )}
          </Stack>

          <Stack spacing={6}>
            <Title order={5}>Course name</Title>
            <Text size="sm">{name}</Text>
          </Stack>

          <Stack spacing={6}>
            <Title order={5}>Course description</Title>
            <Spoiler
              classNames={{ control: classes.spoilerControl }}
              maxHeight={150}
              showLabel="Show more"
              hideLabel="Hide"
            >
              <TextViewer
                size="sm"
                preserveWhiteSpace
                overflowWrap
                withLinkify
                color={!description ? "dimmed" : undefined}
              >
                {description || "No description"}
              </TextViewer>
            </Spoiler>
          </Stack>

          <ConditionalRenderer allow={canAccessFullDetails}>
            <Stack spacing={6}>
              <Group spacing={4}>
                <Title order={5}>Milestone alias</Title>
                <Tooltip
                  label={
                    <Text size="xs">
                      Another name for milestone. This alias will be displayed
                      in place of &apos;milestone&apos;.
                    </Text>
                  }
                  withArrow
                  position="top-start"
                  transition="pop-top-left"
                  transitionDuration={300}
                  multiline
                  width={300}
                >
                  <ThemeIcon color="gray" size="sm" radius="xl">
                    <FaQuestion size={10} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
              <Text size="sm" color={!milestoneAlias ? "dimmed" : undefined}>
                {milestoneAlias || "No alias"}
              </Text>
            </Stack>

            <Stack spacing={6}>
              <Group spacing={4}>
                <Title order={5}>Publish course</Title>
                <Tooltip
                  label={
                    <Text size="xs">
                      Students can view and access this course via{" "}
                      <strong>My Courses</strong>.
                    </Text>
                  }
                  withArrow
                  position="top-start"
                  transition="pop-top-left"
                  transitionDuration={300}
                  multiline
                  width={300}
                >
                  <ThemeIcon color="gray" size="sm" radius="xl">
                    <FaQuestion size={10} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
              <Text
                size="sm"
                weight={500}
                color={isPublished ? "green" : "red"}
              >
                {isPublished ? "Yes" : "No"}
              </Text>
            </Stack>

            <Stack spacing={6}>
              <Group spacing={4}>
                <Title order={5}>Make group members public</Title>
                <Tooltip
                  label={
                    <Text size="xs">
                      Students can view the group members in other groups.
                    </Text>
                  }
                  withArrow
                  position="top-start"
                  transition="pop-top-left"
                  transitionDuration={300}
                  multiline
                  width={300}
                >
                  <ThemeIcon color="gray" size="sm" radius="xl">
                    <FaQuestion size={10} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
              <Text
                size="sm"
                weight={500}
                color={showGroupMembersNames ? "green" : "red"}
              >
                {showGroupMembersNames ? "Yes" : "No"}
              </Text>
            </Stack>

            <Stack spacing={6}>
              <Group spacing={4}>
                <Title order={5}>Students can modify group names</Title>
                <Tooltip
                  label={
                    <Text size="xs">
                      Students can change the names of the groups they are in.
                    </Text>
                  }
                  withArrow
                  position="top-start"
                  transition="pop-top-left"
                  transitionDuration={300}
                  multiline
                  width={300}
                >
                  <ThemeIcon color="gray" size="sm" radius="xl">
                    <FaQuestion size={10} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
              <Text
                size="sm"
                weight={500}
                color={allowStudentsToModifyGroupName ? "green" : "red"}
              >
                {allowStudentsToModifyGroupName ? "Yes" : "No"}
              </Text>
            </Stack>

            <Stack spacing={6}>
              <Title order={5}>Students can create groups</Title>
              <Text
                size="sm"
                weight={500}
                color={allowStudentsToCreateGroups ? "green" : "red"}
              >
                {allowStudentsToCreateGroups ? "Yes" : "No"}
              </Text>
            </Stack>

            <Stack spacing={6}>
              <Group spacing={4}>
                <Title order={5}>Students can delete groups</Title>
                <Tooltip
                  label={
                    <Text size="xs">
                      Students can disband groups for which they are in.
                    </Text>
                  }
                  withArrow
                  position="top-start"
                  transition="pop-top-left"
                  transitionDuration={300}
                  multiline
                  width={300}
                >
                  <ThemeIcon color="gray" size="sm" radius="xl">
                    <FaQuestion size={10} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
              <Text
                size="sm"
                weight={500}
                color={allowStudentsToDeleteGroups ? "green" : "red"}
              >
                {allowStudentsToDeleteGroups ? "Yes" : "No"}
              </Text>
            </Stack>

            <Stack spacing={6}>
              <Title order={5}>Students can join groups</Title>
              <Text
                size="sm"
                weight={500}
                color={allowStudentsToJoinGroups ? "green" : "red"}
              >
                {allowStudentsToJoinGroups ? "Yes" : "No"}
              </Text>
            </Stack>

            <Stack spacing={6}>
              <Title order={5}>Students can leave groups</Title>
              <Text
                size="sm"
                weight={500}
                color={allowStudentsToLeaveGroups ? "green" : "red"}
              >
                {allowStudentsToLeaveGroups ? "Yes" : "No"}
              </Text>
            </Stack>

            <Stack spacing={6}>
              <Group spacing={4}>
                <Title order={5}>Students can add/remove group members</Title>
                <Tooltip
                  label={
                    <Text size="xs">
                      Students can add/remove group members for groups they are
                      in.
                    </Text>
                  }
                  withArrow
                  position="top-start"
                  transition="pop-top-left"
                  transitionDuration={300}
                  multiline
                  width={300}
                >
                  <ThemeIcon color="gray" size="sm" radius="xl">
                    <FaQuestion size={10} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
              <Text
                size="sm"
                weight={500}
                color={allowStudentsToAddOrRemoveGroupMembers ? "green" : "red"}
              >
                {allowStudentsToAddOrRemoveGroupMembers ? "Yes" : "No"}
              </Text>
            </Stack>
          </ConditionalRenderer>
        </Stack>
      </Paper>

      <ConditionalRenderer allow={canModify || canDelete}>
        <Paper
          className={classes.actionsSection}
          withBorder
          shadow="sm"
          p="md"
          radius="md"
        >
          <CourseActionsSection />
        </Paper>
      </ConditionalRenderer>
    </Group>
  );
}

export default CourseDetailsPage;

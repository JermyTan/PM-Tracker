import React, { memo, useMemo } from "react";
import { Card, Text, Group, createStyles, Stack } from "@mantine/core";
import { MdGroup } from "react-icons/md";
import { createSelector } from "@reduxjs/toolkit";
import { skipToken } from "@reduxjs/toolkit/query/react";
import pluralize from "pluralize";
import { GroupSummaryView } from "../types/groups";
import PlaceholderWrapper from "./placeholder-wrapper";
import UserProfileDisplay from "./user-profile-display";
import { useGetCourseGroupsQuery } from "../redux/services/groups-api";
import { CourseData, Role } from "../types/courses";
import { useAppSelector } from "../redux/hooks";
import GroupCardActionsMenu from "./group-card-actions-menu";
import useGetCourseId from "../custom-hooks/use-get-course-id";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    height: "fit-content",
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },

  scrollArea: {
    height: 75,
    margin: 5,
  },

  metaText: {
    letterSpacing: -0.25,
    textTransform: "uppercase",
  },

  buttonIcon: {
    marginLeft: -6,
  },
}));

type Props = {
  groupId: number;
  course?: CourseData;
};

function GroupCard({ groupId, course }: Props) {
  const courseId = useGetCourseId();
  const { classes } = useStyles();

  const userId = useAppSelector(({ currentUser }) => currentUser?.user?.id);
  const hasAdminPermission = course?.role !== Role.Student;

  const selectGroup = useMemo(
    () =>
      createSelector(
        (data?: GroupSummaryView[]) => data,
        (_: unknown, id?: number) => id,
        (data, id) => {
          const group = data?.find((group) => group.id === id);
          const userIsInGroup = group?.members?.some(
            (member) => member.id === userId,
          );
          return {
            group,
            userIsInGroup,
          };
        },
      ),
    [userId],
  );

  // TODO: find out the proper way to handle this
  const { group, userIsInGroup } = useGetCourseGroupsQuery(
    courseId ?? skipToken,
    {
      selectFromResult: ({ data }) => selectGroup(data, groupId),
    },
  );

  const shouldDisplayMembers =
    hasAdminPermission || course.showGroupMembersNames || userIsInGroup;

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Stack spacing="xs">
        <Group position="apart">
          <div>
            <Text size="md" weight={500} lineClamp={1}>
              {group?.name}
            </Text>
            <Text size="sm" color="dimmed">
              <MdGroup />
              {group?.memberCount} {pluralize("members", group?.memberCount)}
            </Text>
          </div>
          <GroupCardActionsMenu
            course={course}
            courseId={courseId}
            group={group}
            hasAdminPermission={hasAdminPermission}
            userIsInGroup={userIsInGroup}
          />
        </Group>
        {shouldDisplayMembers && (
          <PlaceholderWrapper
            py={10}
            loadingMessage="Loading members..."
            defaultMessage="No members found."
            showDefaultMessage={!group?.members || group.members?.length === 0}
          >
            {group?.members?.map((member) => (
              <UserProfileDisplay key={member.id} {...member} />
            ))}
          </PlaceholderWrapper>
        )}
      </Stack>
    </Card>
  );
}

export default memo(GroupCard);

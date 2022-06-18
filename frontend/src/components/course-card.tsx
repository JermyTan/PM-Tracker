import React, { memo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  Text,
  Group,
  createStyles,
  Stack,
  Avatar,
  ScrollArea,
} from "@mantine/core";
import { CourseSummary, Role } from "../types/courses";
import CourseStatusBadge from "./course-status-badge";

const useStyles = createStyles(
  (theme, { userCanAccessCourse }: { userCanAccessCourse?: boolean }) => ({
    card: {
      backgroundColor:
        theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
      height: 300,
      cursor: userCanAccessCourse ? "pointer" : "not-allowed",
    },

    label: {
      textTransform: "uppercase",
      fontSize: theme.fontSizes.xs,
      fontWeight: 700,
    },

    scrollArea: {
      height: 75,
    },

    description: {
      whiteSpace: "break-spaces",
    },

    metaText: {
      letterSpacing: -0.25,
      textTransform: "uppercase",
    },

    hostName: {
      lineHeight: 1,
    },
  }),
);

type Props = CourseSummary;

function CourseCard({
  name,
  description,
  owner,
  isPublished,
  id,
  role,
}: Props) {
  const navigate = useNavigate();

  // const selectCourse = useMemo(
  //   () =>
  //     createSelector(
  //       (data?: CourseSummary[]) => data,
  //       (_: unknown, id: number) => id,
  //       (data, id) => ({
  //         course: data?.find((course) => course.id === id),
  //       }),
  //     ),
  //   [],
  // );

  // const { course } = useGetCoursesQuery(undefined, {
  //   selectFromResult: ({ data }) => selectCourse(data, id),
  // });

  const userCanAccessCourse = isPublished || role !== Role.Student;

  const { classes } = useStyles({ userCanAccessCourse });

  const hasDescription = description.length > 0;

  const redirectToCoursePage = () => {
    if (!userCanAccessCourse) {
      return;
    }

    navigate(`../${id}`);
  };

  return (
    <Card
      onClick={redirectToCoursePage}
      withBorder
      radius="md"
      p="md"
      className={classes.card}
    >
      <Stack spacing="xs">
        <Group position="apart">
          <Text size="lg" weight={500} lineClamp={2}>
            {name}
          </Text>
        </Group>

        <Group spacing="sm">
          <Avatar radius={20} size={20} src={owner.profileImage} />
          <Text size="sm" weight={500} lineClamp={1}>
            {owner.name}
          </Text>
        </Group>
        <ScrollArea offsetScrollbars className={classes.scrollArea}>
          <Text
            className={classes.description}
            size="sm"
            color={hasDescription ? "" : "dimmed"}
          >
            {description || "No description"}
          </Text>
        </ScrollArea>
        <Group>
          <CourseStatusBadge isPublished={isPublished} />
        </Group>
      </Stack>
    </Card>
  );
}

export default memo(CourseCard);

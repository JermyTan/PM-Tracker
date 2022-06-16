import React from "react";
import {
  Card,
  Text,
  Group,
  createStyles,
  Stack,
  Avatar,
  ScrollArea,
} from "@mantine/core";
import { CourseSummaryView, Role } from "../types/courses";
import CourseStatusBadge from "./course-status-badge";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    height: 300,
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

  hostName: {
    lineHeight: 1,
  },
}));

type Props = CourseSummaryView;

function CourseCard({
  name,
  description,
  owner,
  isPublished,
  id: courseId,
  role,
}: Props) {
  const { classes } = useStyles();
  const userCanAccessCourse = isPublished || role != Role.Student;

  const hasDescription = description.length > 0;

  const redirectToCoursePage = (courseId: number) => {
    if (!userCanAccessCourse) {
      return;
    }
    // TODO: redirect to course page
    console.log(`Course id: ${courseId}`);
  };

  return (
    <Card
      onClick={() => redirectToCoursePage(courseId)}
      withBorder
      radius="md"
      p="md"
      className={classes.card}
      sx={{ cursor: userCanAccessCourse ? "pointer" : "not-allowed" }}
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
        <ScrollArea className={classes.scrollArea}>
          <Text size="sm" color={hasDescription ? "" : "dimmed"}>
            {description ? description : "No description"}
          </Text>
        </ScrollArea>
        <Group>
          <CourseStatusBadge isPublished={isPublished} />
        </Group>
      </Stack>
    </Card>
  );
}

export default CourseCard;

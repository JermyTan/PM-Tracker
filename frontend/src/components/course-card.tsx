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
import { CourseSummaryView } from "../types/courses";
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

function CourseCard({ name, description, owner, isPublished }: Props) {
  const { classes } = useStyles();

  const hasDescription = description.length > 0;
  //   const isOwner = owner.id == ;

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Stack spacing="xs">
        <Group position="apart">
          <Text size="lg" weight={500} lineClamp={2}>
            {name}
          </Text>
        </Group>

        <Group spacing="sm">
          <Stack spacing="xs">
            <Text
              size="xs"
              color="dimmed"
              weight={700}
              className={classes.metaText}
            >
              Hosted by
            </Text>
            <Group>
              <Avatar radius={20} size={20} src={owner.profileImage} />
              <Text size="sm" weight={500} lineClamp={1}>
                {owner.name}
              </Text>
            </Group>
          </Stack>
        </Group>
        <ScrollArea className={classes.scrollArea}>
          <Text size="sm" lineClamp={3} color={hasDescription ? "" : "dimmed"}>
            {description ? description : "No description."}
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

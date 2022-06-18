import React, { useMemo } from "react";
import {
  Card,
  Text,
  Group,
  createStyles,
  Stack,
  Button,
  Menu,
} from "@mantine/core";
import { FaChevronDown, FaEdit, FaTrashAlt } from "react-icons/fa";
import { createSelector } from "@reduxjs/toolkit";
import { useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { GroupSummaryView } from "../types/groups";
import PlaceholderWrapper from "./placeholder-wrapper";
import UserProfileDisplay from "./user-profile-display";
import { useGetCourseGroupsQuery } from "../redux/services/groups-api";

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
};

function GroupCard({ groupId }: Props) {
  const { courseId } = useParams();
  const { classes } = useStyles();

  const selectGroup = useMemo(
    () =>
      createSelector(
        (data?: GroupSummaryView[]) => data,
        (_: unknown, id?: number) => id,
        (data, id) => ({
          group: data?.find((group) => group.id === id),
        }),
      ),
    [],
  );

  // TODO: find out the proper way to handle this
  const { group } = useGetCourseGroupsQuery(courseId ?? skipToken, {
    selectFromResult: ({ data }) => selectGroup(data, groupId),
  });

  // const userIsInGroup = false;

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Stack spacing="xs">
        <Group position="apart">
          <Text size="md" weight={500} lineClamp={1}>
            {group?.name}
          </Text>
          {/* <Text style="dimmed">
              {}
          </Text> */}

          <Menu
            control={
              <Button
                rightIcon={
                  <FaChevronDown size={14} className={classes.buttonIcon} />
                }
              />
            }
            placement="end"
          >
            <Menu.Item icon={<FaEdit size={14} />}>Edit members</Menu.Item>
            <Menu.Item icon={<FaTrashAlt size={14} />}>Delete group</Menu.Item>
          </Menu>
        </Group>
        <PlaceholderWrapper
          isLoading={false}
          py={10}
          loadingMessage="Loading members..."
          defaultMessage="No members found"
          showDefaultMessage={!group?.members || group?.members?.length === 0}
        >
          {group?.members?.map((member) => (
            <UserProfileDisplay {...member} />
          ))}
        </PlaceholderWrapper>
      </Stack>
    </Card>
  );
}

export default GroupCard;

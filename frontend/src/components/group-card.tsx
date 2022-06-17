import React from "react";
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
import { GroupSummaryView } from "../types/groups";
import PlaceholderWrapper from "./placeholder-wrapper";
import UserProfileDisplay from "./user-profile-display";

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

type Props = GroupSummaryView;

function GroupCard({ name, id: groupId, memberCount, members }: Props) {
  const { classes } = useStyles();

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Stack spacing="xs">
        <Group position="apart">
          <Text size="lg" weight={500} lineClamp={2}>
            {name}
          </Text>

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
          showDefaultMessage={!members || members?.length === 0}
        >
          {members?.map((member) => (
            <UserProfileDisplay {...member} />
          ))}
        </PlaceholderWrapper>
      </Stack>
    </Card>
  );
}

export default GroupCard;

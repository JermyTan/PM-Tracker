import path from "path";
import {
  useMantineTheme,
  Stack,
  Anchor,
  Group,
  Text,
  Box,
  createStyles,
} from "@mantine/core";
import { ReactNode } from "react";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { colorModeValue } from "../utils/theme-utils";

const useStyles = createStyles({
  childrenContainer: {
    width: "100%",
    alignSelf: "center",
    maxWidth: "800px",
  },
});

type Props = {
  children: ReactNode;
};

function MilestoneTemplatesNestedLayout({ children }: Props) {
  const { colorScheme } = useMantineTheme();
  const { pathname } = useLocation();
  const { classes } = useStyles();

  return (
    <Stack>
      <div>
        <Anchor<typeof Link>
          component={Link}
          to={path.resolve(pathname, "../")}
          color={colorModeValue(colorScheme, {
            lightModeValue: "dark",
            darkModeValue: "gray",
          })}
        >
          <Group spacing={4}>
            <HiOutlineChevronLeft />
            <Text<"span"> component="span" inherit>
              Back
            </Text>
          </Group>
        </Anchor>
      </div>

      <Box className={classes.childrenContainer}>{children}</Box>
    </Stack>
  );
}

export default MilestoneTemplatesNestedLayout;

import path from "path";
import { useMantineTheme, Stack, Anchor, Group, Text } from "@mantine/core";
import { ReactNode } from "react";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { colorModeValue } from "../utils/theme-utils";
import useGetFormContainerStyles from "../custom-hooks/use-get-form-container-style";

type Props = {
  children: ReactNode;
};

function MilestoneTemplatesNestedLayout({ children }: Props) {
  const { colorScheme } = useMantineTheme();
  const { pathname } = useLocation();
  const formContainerClassName = useGetFormContainerStyles();

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

      <div className={formContainerClassName}>{children}</div>
    </Stack>
  );
}

export default MilestoneTemplatesNestedLayout;

import { useMantineTheme, Stack, Anchor, Group, Text } from "@mantine/core";
import { ReactNode } from "react";
import { HiOutlineChevronLeft } from "react-icons/hi";
import { Link, generatePath } from "react-router-dom";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import { COURSE_MILESTONE_TEMPLATES_PATH } from "../routes/paths";
import { colorModeValue } from "../utils/theme-utils";

type Props = {
  children: ReactNode;
};

function MilestoneTemplatesNestedLayout({ children }: Props) {
  const { colorScheme } = useMantineTheme();
  const courseId = useGetCourseId();

  return (
    <Stack>
      <div>
        <Anchor<typeof Link>
          component={Link}
          to={generatePath(COURSE_MILESTONE_TEMPLATES_PATH, {
            courseId,
          })}
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

      {children}
    </Stack>
  );
}

export default MilestoneTemplatesNestedLayout;

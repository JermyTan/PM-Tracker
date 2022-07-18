import {
  Box,
  Button,
  Paper,
  Stack,
  Title,
  useMantineTheme,
} from "@mantine/core";
import { FaChevronLeft } from "react-icons/fa";
import { generatePath, Link } from "react-router-dom";
import { useGetCourseId } from "../../custom-hooks/use-get-course-id";
import { useGetMilestoneAlias } from "../../custom-hooks/use-get-milestone-alias";
import { COURSE_MILESTONE_TEMPLATES_PATH } from "../../routes/paths";
import { colorModeValue } from "../../utils/theme-utils";

function CourseMilestoneTemplatesCreationPage() {
  const { capitalizedMilestoneAlias } = useGetMilestoneAlias();
  const { colorScheme } = useMantineTheme();
  const courseId = useGetCourseId();

  return (
    <Stack>
      <Box>
        <Button<typeof Link>
          component={Link}
          to={generatePath(COURSE_MILESTONE_TEMPLATES_PATH, {
            courseId,
          })}
          leftIcon={<FaChevronLeft />}
          color={colorModeValue(colorScheme, {
            lightModeValue: "dark",
            darkModeValue: "gray",
          })}
          variant="outline"
        >
          Back
        </Button>
      </Box>

      <Paper withBorder shadow="sm" p="md" radius="md">
        <Title order={3}>{capitalizedMilestoneAlias} Template Creation</Title>
      </Paper>
    </Stack>
  );
}

export default CourseMilestoneTemplatesCreationPage;

import { Button, Group, Stack, Title } from "@mantine/core";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

function CourseMilestoneSubmissionsPage() {
  return (
    <Stack>
      <Group position="apart">
        <Title order={3}>Submissions</Title>

        <Button<typeof Link>
          component={Link}
          to="templates"
          color="teal"
          leftIcon={<FaPlus />}
        >
          Create new submission
        </Button>
      </Group>
    </Stack>
  );
}

export default CourseMilestoneSubmissionsPage;

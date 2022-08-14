import {
  Stack,
  ScrollArea,
  Paper,
  Alert,
  createStyles,
  Button,
} from "@mantine/core";
import { HiEyeOff } from "react-icons/hi";
import { ImEnter } from "react-icons/im";
import { generatePath, Link } from "react-router-dom";
import { SINGLE_COURSE_PATH } from "../routes/paths";
import { CourseSummaryData } from "../types/courses";
import TextViewer from "./text-viewer";
import UserProfileDisplay from "./user-profile-display";

const useStyles = createStyles({
  contentContainer: {
    height: "100%",
  },
});

type Props = CourseSummaryData;

function CourseCard(props: Props) {
  const { name, description, owner, isPublished, id } = props;
  const { classes } = useStyles();

  return (
    <Paper shadow="md" withBorder radius="md" p="md">
      <Stack
        spacing="xs"
        justify="space-between"
        className={classes.contentContainer}
      >
        <Stack spacing="xs">
          <TextViewer overflowWrap weight={600} size="lg">
            {name}
          </TextViewer>

          <UserProfileDisplay
            user={owner}
            avatarProps={{ size: 32, radius: 32 }}
            spacing="xs"
          />

          <ScrollArea.Autosize
            scrollbarSize={8}
            type="auto"
            offsetScrollbars
            maxHeight="150px"
          >
            <TextViewer
              preserveWhiteSpace
              overflowWrap
              withLinkify
              size="sm"
              color={!description ? "dimmed" : undefined}
            >
              {description || "No description"}
            </TextViewer>
          </ScrollArea.Autosize>
        </Stack>

        <Stack spacing="xs">
          {!isPublished && (
            <Alert
              p="xs"
              color="orange"
              icon={<HiEyeOff />}
              title="Not published"
            >
              Students cannot view this course.
            </Alert>
          )}

          <Button<typeof Link>
            component={Link}
            to={generatePath(SINGLE_COURSE_PATH, { courseId: `${id}` })}
            variant="subtle"
            rightIcon={<ImEnter size={16} />}
          >
            Enter course
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}

export default CourseCard;

import {
  Button,
  createStyles,
  Group,
  Paper,
  Stack,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { ReactNode } from "react";
import { RiFileAddLine } from "react-icons/ri";
import { generatePath, Link } from "react-router-dom";
import useGetCourseId from "../../custom-hooks/use-get-course-id";
import useGetMilestoneAlias from "../../custom-hooks/use-get-milestone-alias";
import useGetTemplateId from "../../custom-hooks/use-get-template-id";
import { useGetTemplatesQuery } from "../../redux/services/templates-api";
import { COURSE_MILESTONE_TEMPLATES_CREATION_PATH } from "../../routes/paths";
import { useResolveError } from "../../utils/error-utils";
import CourseMilestoneTemplatesTable from "../milestone-templates-table";
import PlaceholderWrapper from "../placeholder-wrapper";

const useStyles = createStyles({
  templateContainer: {
    flex: "1 3 auto",
  },
  templateTableContainer: {
    flex: "1 1 auto",
  },
});

type Props = {
  children: ReactNode;
};

function CourseMilestoneTemplatesPage({ children }: Props) {
  const courseId = useGetCourseId();
  const { capitalizedMilestoneAlias } = useGetMilestoneAlias();
  const { milestoneTemplates, isLoading, error } = useGetTemplatesQuery(
    courseId ?? skipToken,
    {
      selectFromResult: ({ data: milestoneTemplates, isLoading, error }) => ({
        milestoneTemplates,
        isLoading,
        error,
      }),
    },
  );
  // important! The very first (outermost) api call needs to resolve the error
  // subsequent api calls to the same endpoint do not need to resolve error since it is already handled here
  const { errorMessage } = useResolveError({
    error,
    name: "course-milestone-templates-page",
  });
  const templateId = useGetTemplateId();
  const hasSelectedTemplate = Boolean(templateId);
  const { cx, classes } = useStyles();
  const noWrap = useMediaQuery("(min-width: 1400px)");

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      py={150}
      loadingMessage="Loading templates..."
      defaultMessage={errorMessage}
      showDefaultMessage={Boolean(errorMessage)}
    >
      {milestoneTemplates && (
        <Group noWrap={noWrap} align="flex-start">
          {hasSelectedTemplate && (
            <div className={classes.templateContainer}>{children}</div>
          )}

          <Stack className={cx(classes.templateTableContainer)}>
            <Group position="apart">
              <Title order={3}>{capitalizedMilestoneAlias} Templates</Title>
              <Button<typeof Link>
                component={Link}
                to={generatePath(COURSE_MILESTONE_TEMPLATES_CREATION_PATH, {
                  courseId,
                })}
                color="teal"
                leftIcon={<RiFileAddLine />}
              >
                Create new template
              </Button>
            </Group>

            <Paper withBorder shadow="sm" p="md" radius="md">
              <CourseMilestoneTemplatesTable
                milestoneTemplates={milestoneTemplates}
              />
            </Paper>
          </Stack>
        </Group>
      )}
    </PlaceholderWrapper>
  );
}

export default CourseMilestoneTemplatesPage;

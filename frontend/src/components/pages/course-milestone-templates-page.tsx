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
import useGetTemplatePermissions from "../../custom-hooks/use-get-template-permissions";
import { useGetTemplatesQuery } from "../../redux/services/templates-api";
import { COURSE_MILESTONE_TEMPLATES_CREATION_PATH } from "../../routes/paths";
import { useResolveError } from "../../utils/error-utils";
import CourseTemplatesTable from "../course-templates-table";
import PlaceholderWrapper from "../placeholder-wrapper";
import ConditionalRenderer from "../conditional-renderer";
import {
  MAX_FORM_WIDTH,
  MIN_FORM_WIDTH,
} from "../../custom-hooks/use-get-form-container-style";

const useStyles = createStyles(
  (_, { noWrap }: { hasSelectedTemplate?: boolean; noWrap?: boolean }) => ({
    pageContainer: {
      flexDirection: !noWrap ? "column-reverse" : undefined,
    },
    title: {
      lineHeight: 36 / 22, // neighbour's height / font-size
    },
    templateContainer: {
      width: "100%",
      maxWidth: noWrap ? MAX_FORM_WIDTH : undefined,
      minWidth: noWrap ? MIN_FORM_WIDTH : undefined,
    },
    templateTableContainer: {
      minWidth: "650px",
      width: !noWrap ? "100%" : undefined,
      flex: "1 1 auto",
    },
  }),
);

type Props = {
  children: ReactNode;
  studentView?: boolean;
};

function CourseMilestoneTemplatesPage({ children, studentView }: Props) {
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
  const noWrap = useMediaQuery("(min-width: 1400px)");
  const { classes } = useStyles({ noWrap });

  return (
    <PlaceholderWrapper
      isLoading={isLoading}
      py={150}
      loadingMessage="Loading templates..."
      defaultMessage={errorMessage}
      showDefaultMessage={Boolean(errorMessage)}
    >
      {milestoneTemplates && (
        <Group
          className={classes.pageContainer}
          noWrap={noWrap}
          align="flex-start"
        >
          {hasSelectedTemplate && (
            <div className={classes.templateContainer}>{children}</div>
          )}

          <Stack className={classes.templateTableContainer}>
            <Group position="apart">
              <Title className={classes.title} order={3}>
                {capitalizedMilestoneAlias} Templates
              </Title>

              {!studentView && (
                <ConditionalRenderer
                  permissionGetter={{
                    fn: useGetTemplatePermissions,
                    key: "canCreate",
                  }}
                >
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
                </ConditionalRenderer>
              )}
            </Group>

            <Paper withBorder shadow="sm" p="md" radius="md">
              <CourseTemplatesTable
                templates={milestoneTemplates}
                studentView={studentView}
              />
            </Paper>
          </Stack>
        </Group>
      )}
    </PlaceholderWrapper>
  );
}

export default CourseMilestoneTemplatesPage;

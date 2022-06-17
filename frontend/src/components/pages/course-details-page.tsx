import { createStyles, Group, Paper } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { useParams } from "react-router-dom";
import { useGetSingleCourseQuery } from "../../redux/services/courses-api";
import CourseCreationForm from "../course-creation-form";
import CourseActionsSection from "../course-actions-section";
import RoleRestrictedWrapper from "../role-restricted-wrapper";
import { Role } from "../../types/courses";

const useStyles = createStyles({
  detailsSection: {
    flex: "1 1 auto",
  },
  actionsSection: {
    width: "250px",
  },
});

function CourseDetailsPage() {
  const { courseId } = useParams();
  const { course } = useGetSingleCourseQuery(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({ course }),
  });
  const { classes } = useStyles();

  const {
    name,
    owner,
    description,
    milestoneAlias,
    isPublished,
    showGroupMembersNames,
    allowStudentsToModifyGroupName,
    allowStudentsToCreateGroups,
    allowStudentsToDeleteGroups,
    allowStudentsToJoinGroups,
    allowStudentsToLeaveGroups,
    allowStudentsToAddOrRemoveGroupMembers,
  } = course ?? {};

  return (
    <Group align="start">
      <Paper
        className={classes.detailsSection}
        withBorder
        shadow="sm"
        p="md"
        radius="md"
      >
        <CourseCreationForm />
      </Paper>

      <RoleRestrictedWrapper allowedRoles={[Role.CoOwner]}>
        <Paper
          className={classes.actionsSection}
          withBorder
          shadow="sm"
          p="md"
          radius="md"
        >
          <CourseActionsSection />
        </Paper>
      </RoleRestrictedWrapper>
    </Group>
  );
}

export default CourseDetailsPage;

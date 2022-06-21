import { Button, Group, Stack } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/dist/query";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { ImFilesEmpty } from "react-icons/im";
import { Link, useParams } from "react-router-dom";
import { capitalCase } from "change-case";
import { MILESTONE } from "../../constants";
import { useGetSingleCourseQueryState } from "../../redux/services/courses-api";
import { Role } from "../../types/courses";
import RoleRestrictedWrapper from "../role-restricted-wrapper";

function CourseMilestonesPage() {
  const { courseId } = useParams();
  const { milestoneAlias } = useGetSingleCourseQueryState(
    courseId ?? skipToken,
    {
      selectFromResult: ({ data: course }) => ({
        milestoneAlias: course?.milestoneAlias,
      }),
    },
  );
  return (
    <Stack>
      <RoleRestrictedWrapper allowedRoles={[Role.CoOwner, Role.Instructor]}>
        <Group position="right">
          <Button color="teal" leftIcon={<MdOutlineLibraryAdd />}>
            Create new {milestoneAlias || MILESTONE}
          </Button>
          <Button<typeof Link>
            component={Link}
            to="../templates"
            leftIcon={<ImFilesEmpty />}
          >
            {capitalCase(milestoneAlias || MILESTONE)} templates
          </Button>
        </Group>
      </RoleRestrictedWrapper>
      <div>Hello</div>
    </Stack>
  );
}

export default CourseMilestonesPage;

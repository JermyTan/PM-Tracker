import { Button, Group, SimpleGrid, Stack } from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import pluralize from "pluralize";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { ImFilesEmpty } from "react-icons/im";
import { Link, useParams } from "react-router-dom";
import { capitalCase } from "change-case";
import { Role } from "../../types/courses";
import RoleRestrictedWrapper from "../role-restricted-wrapper";
import PlaceholderWrapper from "../placeholder-wrapper";
import { useGetMilestonesQuery } from "../../redux/services/milestones-api";
import { useResolveError } from "../../utils/error-utils";
import { useGetMilestoneAlias } from "../../custom-hooks/use-get-milestone-alias";
import MilestoneCard from "../milestone-card";

function CourseMilestonesPage() {
  const { courseId } = useParams();
  const {
    data: milestones,
    isLoading,
    error,
  } = useGetMilestonesQuery(courseId ?? skipToken);
  useResolveError(error);
  const milestoneAlias = useGetMilestoneAlias();

  return (
    <Stack>
      <RoleRestrictedWrapper allowedRoles={[Role.CoOwner, Role.Instructor]}>
        <Group position="right">
          <Button color="teal" leftIcon={<MdOutlineLibraryAdd />}>
            Create new {milestoneAlias}
          </Button>
          <Button<typeof Link>
            component={Link}
            to="../templates"
            leftIcon={<ImFilesEmpty />}
          >
            {capitalCase(milestoneAlias)} templates
          </Button>
        </Group>
      </RoleRestrictedWrapper>

      <PlaceholderWrapper
        isLoading={isLoading}
        py={150}
        loadingMessage={`Loading ${pluralize(milestoneAlias)}...`}
        defaultMessage={`No ${pluralize(milestoneAlias)} found`}
        showDefaultMessage={!milestones || milestones.length === 0}
      >
        <SimpleGrid cols={3} spacing="xs">
          {milestones?.map((milestone) => (
            <MilestoneCard key={milestone.id} {...milestone} />
          ))}
        </SimpleGrid>
      </PlaceholderWrapper>
    </Stack>
  );
}

export default CourseMilestonesPage;

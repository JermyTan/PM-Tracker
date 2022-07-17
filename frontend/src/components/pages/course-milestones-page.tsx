import { useDisclosure } from "@mantine/hooks";
import {
  Button,
  Drawer,
  Group,
  ScrollArea,
  SimpleGrid,
  Stack,
  Title,
} from "@mantine/core";
import { skipToken } from "@reduxjs/toolkit/query/react";
import pluralize from "pluralize";
import { MdOutlineLibraryAdd } from "react-icons/md";
import { ImFilesEmpty } from "react-icons/im";
import { Link } from "react-router-dom";
import { Role } from "../../types/courses";
import RoleRestrictedWrapper from "../role-restricted-wrapper";
import PlaceholderWrapper from "../placeholder-wrapper";
import { useGetMilestonesQuery } from "../../redux/services/milestones-api";
import { useResolveError } from "../../utils/error-utils";
import { useGetMilestoneAlias } from "../../custom-hooks/use-get-milestone-alias";
import MilestoneCard from "../milestone-card";
import { useGetCourseId } from "../../custom-hooks/use-get-course-id";
import MilestoneCreationForm from "../milestone-creation-form";

function CourseMilestonesPage() {
  const courseId = useGetCourseId();
  const { milestones, isLoading, error } = useGetMilestonesQuery(
    courseId ?? skipToken,
    {
      selectFromResult: ({ data: milestones, isLoading, error }) => ({
        milestones,
        isLoading,
        error,
      }),
    },
  );
  // important! The very first (outermost) api call needs to resolve the error
  // subsequent api calls to the same endpoint do not need to resolve error since it is already handled here
  useResolveError({ error, name: "course-milestones-page" });
  const { milestoneAlias, capitalizedMilestoneAlias } = useGetMilestoneAlias();
  const [isDrawerOpened, { open, close }] = useDisclosure(false);
  const pluralizedMilestoneAlias = pluralize(milestoneAlias);

  return (
    <>
      <Drawer
        opened={isDrawerOpened}
        onClose={close}
        position="right"
        size="xl"
        padding="lg"
        closeButtonLabel={`Cancel ${milestoneAlias} creation`}
        title={<Title order={2}>{capitalizedMilestoneAlias} Creation</Title>}
      >
        <ScrollArea offsetScrollbars pr="xs" scrollbarSize={8}>
          <MilestoneCreationForm onSuccess={close} />
        </ScrollArea>
      </Drawer>

      <Stack>
        <RoleRestrictedWrapper allowedRoles={[Role.CoOwner, Role.Instructor]}>
          <Group position="right">
            <Button<typeof Link>
              component={Link}
              to="../templates"
              leftIcon={<ImFilesEmpty />}
            >
              {capitalizedMilestoneAlias} templates
            </Button>
            <Button
              color="teal"
              leftIcon={<MdOutlineLibraryAdd />}
              onClick={open}
            >
              Create new {milestoneAlias}
            </Button>
          </Group>
        </RoleRestrictedWrapper>

        <PlaceholderWrapper
          isLoading={isLoading}
          py={150}
          loadingMessage={`Loading ${pluralizedMilestoneAlias}...`}
          defaultMessage={`No ${pluralizedMilestoneAlias} found`}
          showDefaultMessage={!milestones || milestones.length === 0}
        >
          <SimpleGrid
            cols={4}
            breakpoints={[
              { maxWidth: "sm", cols: 1 },
              { maxWidth: "md", cols: 2 },
              { maxWidth: "xl", cols: 3 },
            ]}
            spacing="xs"
          >
            {milestones?.map((milestone) => (
              <MilestoneCard key={milestone.id} {...milestone} />
            ))}
          </SimpleGrid>
        </PlaceholderWrapper>
      </Stack>
    </>
  );
}

export default CourseMilestonesPage;

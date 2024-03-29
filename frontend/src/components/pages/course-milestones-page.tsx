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
import ConditionalRenderer from "../conditional-renderer";
import PlaceholderWrapper from "../placeholder-wrapper";
import { useGetMilestonesQuery } from "../../redux/services/milestones-api";
import { useResolveError } from "../../utils/error-utils";
import useGetMilestoneAlias from "../../custom-hooks/use-get-milestone-alias";
import MilestoneCard from "../milestone-card";
import useGetCourseId from "../../custom-hooks/use-get-course-id";
import MilestoneCreationForm from "../milestone-creation-form";
import useGetMilestonePermissions from "../../custom-hooks/use-get-milestone-permissions";
import useGetTemplatePermissions from "../../custom-hooks/use-get-template-permissions";
import useGetScrollAreaContainerPaddingStyle from "../../custom-hooks/use-get-scroll-area-container-padding-style";

function CourseMilestonesPage() {
  const courseId = useGetCourseId();
  const { scrollAreaContainerClassName, scrollbarSize, referencePadding } =
    useGetScrollAreaContainerPaddingStyle({
      scrollbarSize: 8,
      referencePadding: 20,
    });
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
  const { canCreate: canCreateMilestone } = useGetMilestonePermissions();
  const { canManage: canManageTemplates } = useGetTemplatePermissions();
  const pluralizedMilestoneAlias = pluralize(milestoneAlias);

  return (
    <>
      <Drawer
        classNames={{ drawer: scrollAreaContainerClassName }}
        opened={isDrawerOpened}
        onClose={close}
        position="right"
        size="xl"
        closeButtonLabel={`Cancel ${milestoneAlias} creation`}
        title={<Title order={3}>{capitalizedMilestoneAlias} Creation</Title>}
      >
        <ScrollArea pr={referencePadding} scrollbarSize={scrollbarSize}>
          <MilestoneCreationForm onSuccess={close} />
        </ScrollArea>
      </Drawer>

      <Stack>
        <ConditionalRenderer allow={canCreateMilestone || canManageTemplates}>
          <Group position="right">
            <ConditionalRenderer allow={canManageTemplates}>
              <Button<typeof Link>
                component={Link}
                to="../templates"
                leftIcon={<ImFilesEmpty />}
              >
                {capitalizedMilestoneAlias} templates
              </Button>
            </ConditionalRenderer>

            <ConditionalRenderer allow={canCreateMilestone}>
              <Button
                color="teal"
                leftIcon={<MdOutlineLibraryAdd />}
                onClick={open}
              >
                Create new {milestoneAlias}
              </Button>
            </ConditionalRenderer>
          </Group>
        </ConditionalRenderer>

        <PlaceholderWrapper
          isLoading={isLoading}
          py={150}
          loadingMessage={`Loading ${pluralizedMilestoneAlias}...`}
          defaultMessage={`No ${pluralizedMilestoneAlias} found.`}
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

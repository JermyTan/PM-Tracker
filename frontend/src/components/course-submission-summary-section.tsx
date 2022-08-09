import { Stack, Title, Text, SimpleGrid } from "@mantine/core";
import { DATE_TIME_MONTH_NAME_FORMAT } from "../constants";
import { SubmissionSummaryData } from "../types/submissions";
import { displayDateTime } from "../utils/transform-utils";
import SubmissionTypeIconLabel from "./submission-type-icon-label";
import TextViewer from "./text-viewer";

type Props = SubmissionSummaryData;

function CourseSubmissionSummarySection({
  id,
  createdAt,
  updatedAt,
  name,
  description,
  isDraft,
  submissionType,
  creator,
  editor,
  group,
}: Props) {
  return (
    <Stack>
      <Title order={4}>Submission Summary</Title>

      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: "sm", cols: 1 },
          { maxWidth: "md", cols: 2 },
          { maxWidth: "xl", cols: 3 },
        ]}
      >
        <div>
          <Text size="sm" weight={700}>
            ID
          </Text>
          <Text size="sm">{id}</Text>
        </div>

        <div>
          <Text size="sm" weight={700}>
            Name
          </Text>
          <Text size="sm">{name}</Text>
        </div>

        <div>
          <Text size="sm" weight={700}>
            Description
          </Text>
          <TextViewer
            color={!description ? "dimmed" : undefined}
            size="sm"
            preserveWhiteSpace
            overflowWrap
            withLinkify
          >
            {description || "No description"}
          </TextViewer>
        </div>

        <div>
          <Text size="sm" weight={700}>
            Submission type
          </Text>
          <Text size="sm">
            <SubmissionTypeIconLabel submissionType={submissionType} />
          </Text>
        </div>

        <div>
          <Text size="sm" weight={700}>
            Is draft?
          </Text>
          <Text size="sm" weight={500} color={isDraft ? "green" : "red"}>
            {isDraft ? "Yes" : "No"}
          </Text>
        </div>

        <div>
          <Text size="sm" weight={700}>
            Group
          </Text>
          <Text size="sm" color={!group ? "dimmed" : undefined}>
            {group?.name || "No group"}
          </Text>
        </div>

        <div>
          <Text size="sm" weight={700}>
            Created by
          </Text>
          <Text color={!creator?.name ? "red" : undefined} size="sm">
            {creator?.name
              ? `${creator.name} @ ${displayDateTime(
                  createdAt,
                  DATE_TIME_MONTH_NAME_FORMAT,
                )}`
              : "Unknown"}
          </Text>
        </div>

        <div>
          <Text size="sm" weight={700}>
            Last updated by
          </Text>
          <Text color={!editor?.name ? "red" : undefined} size="sm">
            {editor?.name
              ? `${editor.name} @ ${displayDateTime(
                  updatedAt,
                  DATE_TIME_MONTH_NAME_FORMAT,
                )}`
              : "Unknown"}
          </Text>
        </div>

        <div>
          <Text size="sm" weight={700}>
            Visibility
          </Text>
          <Text size="sm">Private</Text>
        </div>
      </SimpleGrid>
    </Stack>
  );
}

export default CourseSubmissionSummarySection;

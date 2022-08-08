import { Stack, Title, Text, SimpleGrid } from "@mantine/core";
import { DATE_TIME_MONTH_NAME_FORMAT } from "../constants";
import { SubmissionSummaryData } from "../types/submissions";
import { displayDateTime } from "../utils/transform-utils";
import SubmissionTypeIconLabel from "./submission-type-icon-label";
import TextViewer from "./text-viewer";

type Props = SubmissionSummaryData;

function SubmissionSummarySection({
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
        spacing="xs"
      >
        <div>
          <Text size="sm" weight={700}>
            Name
          </Text>
          <TextViewer size="sm" overflowWrap>
            {name}
          </TextViewer>
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
          <TextViewer
            size="sm"
            overflowWrap
            color={!group ? "dimmed" : undefined}
          >
            {group?.name || "No group"}
          </TextViewer>
        </div>

        <div>
          <Text size="sm" weight={700}>
            Created by
          </Text>
          <TextViewer
            color={!creator?.name ? "red" : undefined}
            size="sm"
            overflowWrap
          >
            {creator?.name
              ? `${creator.name} @ ${displayDateTime(
                  createdAt,
                  DATE_TIME_MONTH_NAME_FORMAT,
                )}`
              : "Unknown"}
          </TextViewer>
        </div>

        <div>
          <Text size="sm" weight={700}>
            Last updated by
          </Text>
          <TextViewer
            color={!editor?.name ? "red" : undefined}
            size="sm"
            overflowWrap
          >
            {editor?.name
              ? `${editor.name} @ ${displayDateTime(
                  updatedAt,
                  DATE_TIME_MONTH_NAME_FORMAT,
                )}`
              : "Unknown"}
          </TextViewer>
        </div>
      </SimpleGrid>
    </Stack>
  );
}

export default SubmissionSummarySection;

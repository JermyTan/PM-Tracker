import { Stack, Title, Text, SimpleGrid, Anchor } from "@mantine/core";
import { Link } from "react-router-dom";
import { DATE_TIME_MONTH_NAME_FORMAT, UNKNOWN_USER } from "../constants";
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
          <Anchor<typeof Link> size="sm" component={Link} to={`${id}`}>
            {name}
          </Anchor>
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
            {`${creator?.name ?? UNKNOWN_USER} @ ${displayDateTime(
              createdAt,
              DATE_TIME_MONTH_NAME_FORMAT,
            )}`}
          </Text>
        </div>

        <div>
          <Text size="sm" weight={700}>
            Last updated by
          </Text>
          <Text color={!editor?.name ? "red" : undefined} size="sm">
            {`${editor?.name ?? UNKNOWN_USER} @ ${displayDateTime(
              updatedAt,
              DATE_TIME_MONTH_NAME_FORMAT,
            )}`}
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

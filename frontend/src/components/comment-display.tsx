import { Avatar, Group, Text } from "@mantine/core";
import { SubmissionFieldComment } from "../types/comments";

type Props = {
  comment: SubmissionFieldComment;
};

function CommentDisplay({ comment }: Props) {
  const commenter = comment.commenter;

  return (
    <>
      <Group>
        <Avatar src={commenter.profileImage} alt={commenter.name} radius="xl" />
        <div>
          <Text size="sm">{commenter.name}</Text>
          <Text size="xs" color="dimmed">
            {}
          </Text>
        </div>
      </Group>
    </>
  );
}

export default CommentDisplay;

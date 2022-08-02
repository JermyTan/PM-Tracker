import { Avatar, Group, Text, Alert, Stack, ActionIcon } from "@mantine/core";
import { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { DATE_TIME_MONTH_NAME_FORMAT } from "../constants";
import { useAppSelector } from "../redux/hooks";
import { SubmissionFieldComment } from "../types/comments";
import { displayDateTime } from "../utils/transform-utils";
import CommentContentDisplayAndEditor from "./comment-content-display-and-editor";

type Props = {
  comment: SubmissionFieldComment;
};

function CommentDisplay({ comment }: Props) {
  const [isEditingComment, setIsEditingComment] = useState(false);

  const userId = useAppSelector(({ currentUser }) => currentUser?.user?.id);

  const { commenter } = comment;
  const canEditComment = userId === commenter.id;

  return (
    <Group align="flex-start" noWrap>
      <Avatar src={commenter.profileImage} alt={commenter.name} radius="xl" />

      <Stack spacing={6}>
        <Group position="apart">
          <Group>
            <div>
              <Text size="sm">{commenter.name}</Text>
              <Text size="xs" color="dimmed">
                {comment.role}
              </Text>
            </div>
          </Group>
          {/* TODO: add delete */}
          {canEditComment && (
            <ActionIcon onClick={() => setIsEditingComment(true)}>
              <FaEdit />
            </ActionIcon>
          )}
        </Group>
        {comment.isDeleted ? (
          <Alert p="xs" color="gray">
            This comment has been deleted.
          </Alert>
        ) : (
          <CommentContentDisplayAndEditor
            comment={comment}
            isEditingComment={isEditingComment}
            onEditSuccess={() => setIsEditingComment(false)}
          />
        )}
        <Text size="xs" color="dimmed">
          {displayDateTime(comment.createdAt, DATE_TIME_MONTH_NAME_FORMAT)}
        </Text>
      </Stack>
    </Group>
  );
}

export default CommentDisplay;

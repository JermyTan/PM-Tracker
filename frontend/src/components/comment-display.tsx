import {
  Avatar,
  Group,
  Text,
  Alert,
  Stack,
  Menu,
  ActionIcon,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useState } from "react";
import { FaEdit, FaChevronDown, FaTrashAlt } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { DATE_TIME_MONTH_NAME_FORMAT } from "../constants";
import { useAppSelector } from "../redux/hooks";
import { SubmissionComment } from "../types/comments";
import { displayDateTime } from "../utils/transform-utils";
import CommentContentDisplayAndEditor from "./comment-content-display-and-editor";
import CommentDeleteConfirmation from "./comment-delete-confirmation";

type Props = {
  comment: SubmissionComment;
  courseId: number | string;
  submissionId: number;
};

function CommentDisplay({ comment, courseId, submissionId }: Props) {
  const [isEditingComment, setIsEditingComment] = useState(false);

  const userId = useAppSelector(({ currentUser }) => currentUser?.user?.id);
  const { commenter } = comment;
  const canModifyComment = userId === commenter.id && !comment.isDeleted;

  const modals = useModals();

  const openDeleteCommentModal = () => {
    const id = modals.openModal({
      title: "Delete comment",
      children: (
        <CommentDeleteConfirmation
          courseId={courseId}
          submissionId={submissionId}
          commentId={comment.id}
          onSuccess={() => modals.closeModal(id)}
        />
      ),
    });
  };

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
          {canModifyComment && (
            <Menu
              position="bottom-end"
              transition="pop-bottom-right"
              // hidden={isEditingComment}
            >
              <Menu.Target>
                <ActionIcon>
                  <FaChevronDown />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  icon={<FaEdit size={14} />}
                  onClick={() => {
                    setIsEditingComment(true);
                  }}
                >
                  Edit comment
                </Menu.Item>

                <Menu.Item
                  icon={<FaTrashAlt size={14} color="red" />}
                  onClick={openDeleteCommentModal}
                >
                  Delete comment
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
          {isEditingComment && (
            <ActionIcon
              onClick={() => {
                setIsEditingComment(false);
              }}
            >
              <IoMdClose />
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

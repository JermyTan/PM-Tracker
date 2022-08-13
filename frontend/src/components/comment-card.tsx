import {
  Avatar,
  Group,
  Text,
  Alert,
  Stack,
  Menu,
  ActionIcon,
  createStyles,
  Button,
  Modal,
} from "@mantine/core";
import { useDisclosure, useHover } from "@mantine/hooks";
import { useState } from "react";
import { BiCommentEdit, BiCommentX } from "react-icons/bi";
import { IoIosMore, IoMdClose } from "react-icons/io";
import { DATE_TIME_MONTH_NAME_FORMAT } from "../constants";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import useGetSubmissionId from "../custom-hooks/use-get-submission-id";
import { useAppSelector } from "../redux/hooks";
import {
  useDeleteSubmissionCommentMutation,
  useUpdateSubmissionCommentMutation,
} from "../redux/services/comments-api";
import { SubmissionComment } from "../types/comments";
import { roleToPropertiesMap } from "../types/courses";
import { useResolveError } from "../utils/error-utils";
import toastUtils from "../utils/toast-utils";
import { displayDateTime } from "../utils/transform-utils";
import CommentForm, { CommentFormData } from "./comment-form";
import TextViewer from "./text-viewer";

const useStyles = createStyles({
  textContainer: {
    flex: "1 1 auto",
  },
});

type Props = SubmissionComment;

function CommentCard(props: Props) {
  const { id, content, commenter, role, isDeleted, createdAt, updatedAt } =
    props;
  const courseId = useGetCourseId();
  const submissionId = useGetSubmissionId();
  const isEdited = createdAt !== updatedAt;
  const [isEditingComment, setEditingComment] = useState(false);
  const userId = useAppSelector(({ currentUser }) => currentUser?.user?.id);
  const { classes } = useStyles();
  const { ref, hovered } = useHover();
  const [
    isDeleteModalOpened,
    { open: openDeleteModal, close: closeDeleteModal },
  ] = useDisclosure(false);
  const [updateComment, { isUpdating }] = useUpdateSubmissionCommentMutation({
    selectFromResult: ({ isLoading: isUpdating }) => ({ isUpdating }),
  });
  const [deleteComment, { isDeleting }] = useDeleteSubmissionCommentMutation({
    selectFromResult: ({ isLoading: isDeleting }) => ({ isDeleting }),
  });
  const { resolveError } = useResolveError({ name: "commend-card" });

  const canModifyComment = userId === commenter.id && !isDeleted;

  const onUpdateComment = async (formData: CommentFormData) => {
    if (isUpdating || courseId === undefined || submissionId === undefined) {
      return;
    }

    await updateComment({
      ...formData,
      courseId,
      submissionId,
      commentId: id,
    }).unwrap();

    toastUtils.success({
      message: "The comment has been updated successfully.",
    });

    setEditingComment(false);
  };

  const onDeleteComment = async () => {
    if (isDeleting || courseId === undefined || submissionId === undefined) {
      return;
    }

    try {
      await deleteComment({ courseId, submissionId, commentId: id }).unwrap();

      toastUtils.success({
        message: `The comment has been deleted successfully.`,
      });
      closeDeleteModal();
    } catch (error) {
      resolveError(error);
    }
  };

  const contentComponent = (
    <TextViewer size="sm" preserveWhiteSpace overflowWrap withLinkify>
      {content}
    </TextViewer>
  );

  const mainViewComponent = (() => {
    if (isDeleted) {
      return (
        <Alert p={4} color="gray">
          <Text color="dimmed" italic size="sm">
            Comment has been deleted.
          </Text>
        </Alert>
      );
    }

    return isEditingComment ? (
      <CommentForm
        defaultValues={{ content }}
        type="existing"
        onSubmit={onUpdateComment}
      />
    ) : (
      contentComponent
    );
  })();

  return (
    <Group py="xs" align="flex-start" noWrap spacing="sm" ref={ref}>
      <Modal
        opened={isDeleteModalOpened}
        onClose={closeDeleteModal}
        centered
        title="Delete comment"
        closeButtonLabel="Cancel comment deletion"
      >
        <Stack>
          <Text size="sm">Are you sure you want to delete this comment?</Text>

          {contentComponent}

          <Group position="right">
            <Button variant="default" onClick={closeDeleteModal}>
              No don&apos;t delete
            </Button>
            <Button color="red" loading={isDeleting} onClick={onDeleteComment}>
              Delete comment
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Avatar
        src={commenter.profileImage || undefined}
        alt=""
        size={32}
        radius={32}
      />

      <Stack className={classes.textContainer} spacing={6}>
        <Group align="flex-start" position="apart" noWrap>
          <div>
            <Text size="sm">{commenter.name}</Text>
            <Text size="xs" color="dimmed">
              {role !== null
                ? roleToPropertiesMap[role].label
                : "Ex-course member"}
            </Text>
          </div>
          {hovered && canModifyComment && !isEditingComment && (
            <Menu position="left-start" transition="pop-top-right">
              <Menu.Target>
                <ActionIcon aria-label="More actions">
                  <IoIosMore />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  icon={<BiCommentEdit />}
                  onClick={() => setEditingComment(true)}
                >
                  Edit comment
                </Menu.Item>

                <Menu.Item
                  icon={<BiCommentX color="red" />}
                  onClick={openDeleteModal}
                >
                  Delete comment
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}

          {isEditingComment && (
            <ActionIcon
              arial-label="Cancel comment update"
              onClick={() => setEditingComment(false)}
            >
              <IoMdClose />
            </ActionIcon>
          )}
        </Group>

        {mainViewComponent}

        <Text size="xs" color="dimmed">
          {displayDateTime(createdAt, DATE_TIME_MONTH_NAME_FORMAT)}
          {!isDeleted && isEdited && " (edited)"}
        </Text>
      </Stack>
    </Group>
  );
}

export default CommentCard;

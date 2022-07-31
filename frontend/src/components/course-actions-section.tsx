import {
  Stack,
  Button,
  StackProps,
  Drawer,
  ScrollArea,
  Title,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import { useAppSelector } from "../redux/hooks";
import {
  useDeleteCourseMutation,
  useGetSingleCourseQueryState,
} from "../redux/services/courses-api";
import { MY_COURSES_PATH } from "../routes/paths";
import { useResolveError } from "../utils/error-utils";
import toastUtils from "../utils/toast-utils";
import CourseEditForm from "./course-edit-form";

type Props = StackProps;

function CourseActionsSection(props: Props) {
  const userId = useAppSelector(({ currentUser }) => currentUser?.user?.id);
  const courseId = useGetCourseId();
  const { ownerId } = useGetSingleCourseQueryState(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({ ownerId: course?.owner.id }),
  });
  const [deleteCourse, { isLoading }] = useDeleteCourseMutation({
    selectFromResult: ({ isLoading }) => ({ isLoading }),
  });
  const { resolveError } = useResolveError({ name: "course-actions-section" });
  const [isDrawerOpened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const modals = useModals();

  const onDeleteCourse = async () => {
    if (isLoading || courseId === undefined) {
      return;
    }

    try {
      await deleteCourse(courseId).unwrap();

      toastUtils.success({
        message: "The course has been successfully deleted.",
      });

      // TODO: navigate will trigger after rtk query has invalidated the current course tag
      // so there will be an api call being made by any mounted useGetSingleCourseQuery but 404 will be returned.
      // one potential fix is to use useEffect and useLazyGetSingleCourseQuery to manually pull data instead of
      // using useGetSingleCourseQuery due to auto-refetching
      navigate(MY_COURSES_PATH);
    } catch (error) {
      resolveError(error);
    }
  };

  const openDeleteModal = () =>
    modals.openConfirmModal({
      title: "Delete this course",
      closeButtonLabel: "Cancel course deletion",
      centered: true,
      children: (
        <Text size="sm">
          Are you sure you want to delete this course?
          <br />
          <strong>This action is destructive and irreversible.</strong> All
          related course content (e.g. milestone templates and submissions) will
          be deleted as well.
        </Text>
      ),
      labels: { confirm: "Delete course", cancel: "No don't delete" },
      confirmProps: { color: "red", loading: isLoading },
      onConfirm: onDeleteCourse,
    });

  return (
    <>
      <Drawer
        opened={isDrawerOpened}
        onClose={close}
        position="right"
        size="xl"
        padding="lg"
        closeButtonLabel="Cancel course update"
        title={<Title order={2}>Course Update</Title>}
      >
        {/* special case: this conditional render is required as course edit form is mounted and api call will be made
        even though the drawer is not yet opened */}
        {isDrawerOpened && (
          <ScrollArea offsetScrollbars pr="xs" scrollbarSize={8}>
            <CourseEditForm onSuccess={close} />
          </ScrollArea>
        )}
      </Drawer>

      <Stack {...props}>
        <Button onClick={open} leftIcon={<MdEdit />}>
          Edit course
        </Button>
        {userId !== undefined && userId === ownerId && (
          <Button
            onClick={openDeleteModal}
            color="red"
            leftIcon={<MdDeleteForever />}
            disabled={isLoading}
            loading={isLoading}
          >
            Delete course
          </Button>
        )}
      </Stack>
    </>
  );
}

export default CourseActionsSection;

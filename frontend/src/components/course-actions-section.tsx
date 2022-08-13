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
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import useGetCoursePermissions from "../custom-hooks/use-get-course-permissions";
import useGetScrollAreaContainerPaddingStyle from "../custom-hooks/use-get-scroll-area-container-padding-style";
import { useDeleteCourseMutation } from "../redux/services/courses-api";
import { MY_COURSES_PATH } from "../routes/paths";
import { useResolveError } from "../utils/error-utils";
import toastUtils from "../utils/toast-utils";
import ConditionalRenderer from "./conditional-renderer";
import CourseEditForm from "./course-edit-form";

type Props = StackProps;

function CourseActionsSection(props: Props) {
  const courseId = useGetCourseId();
  const { scrollAreaContainerClassName, scrollbarSize, adjustedPadding } =
    useGetScrollAreaContainerPaddingStyle({
      scrollbarSize: 8,
      referencePadding: 20,
    });
  const [deleteCourse, { isLoading }] = useDeleteCourseMutation({
    selectFromResult: ({ isLoading }) => ({ isLoading }),
  });
  const { resolveError } = useResolveError({ name: "course-actions-section" });
  const [isDrawerOpened, { open, close }] = useDisclosure(false);
  const navigate = useNavigate();
  const modals = useModals();
  const { canModify, canDelete } = useGetCoursePermissions();

  const onDeleteCourse = async () => {
    if (isLoading || courseId === undefined) {
      return;
    }

    try {
      await deleteCourse(courseId).unwrap();

      toastUtils.success({
        message: "The course has been deleted successfully.",
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
      confirmProps: { color: "red" },
      onConfirm: onDeleteCourse,
    });

  return (
    <>
      <ConditionalRenderer allow={canModify}>
        <Drawer
          classNames={{ drawer: scrollAreaContainerClassName }}
          opened={isDrawerOpened}
          onClose={close}
          position="right"
          size="xl"
          closeButtonLabel="Cancel course update"
          title={<Title order={3}>Course Update</Title>}
        >
          {/* special case: this conditional render is required as course edit form is mounted and api call will be made
        even though the drawer is not yet opened */}
          {isDrawerOpened && (
            <ScrollArea
              offsetScrollbars
              pr={adjustedPadding}
              scrollbarSize={scrollbarSize}
            >
              <CourseEditForm onSuccess={close} />
            </ScrollArea>
          )}
        </Drawer>
      </ConditionalRenderer>

      <ConditionalRenderer allow={canModify || canDelete}>
        <Stack {...props}>
          <ConditionalRenderer allow={canModify}>
            <Button onClick={open} leftIcon={<MdEdit size={16} />}>
              Edit course
            </Button>
          </ConditionalRenderer>
          <ConditionalRenderer allow={canDelete}>
            <Button
              onClick={openDeleteModal}
              color="red"
              leftIcon={<MdDeleteForever size={16} />}
              loading={isLoading}
            >
              Delete course
            </Button>
          </ConditionalRenderer>
        </Stack>
      </ConditionalRenderer>
    </>
  );
}

export default CourseActionsSection;

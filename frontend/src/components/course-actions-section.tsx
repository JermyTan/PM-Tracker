import {
  Stack,
  Button,
  StackProps,
  Drawer,
  ScrollArea,
  Title,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { MdEdit } from "react-icons/md";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { useGetSingleCourseQuery } from "../redux/services/courses-api";
import CourseEditForm from "./course-edit-form";
import DeleteCourseButton from "./delete-course-button";

type Props = StackProps;

function CourseActionsSection(props: Props) {
  const userId = useAppSelector(({ currentUser }) => currentUser?.user?.id);
  const { courseId } = useParams();
  const { ownerId } = useGetSingleCourseQuery(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({ ownerId: course?.owner.id }),
  });
  const [isDrawerOpened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Drawer
        opened={isDrawerOpened}
        onClose={close}
        position="right"
        size="xl"
        padding="lg"
        closeButtonLabel="Cancel course creation"
        title={<Title order={2}>Edit Course Settings</Title>}
      >
        <ScrollArea offsetScrollbars pr="xs" scrollbarSize={8}>
          <CourseEditForm onSuccess={close} />
        </ScrollArea>
      </Drawer>
      <Stack {...props}>
        <Button onClick={open} leftIcon={<MdEdit />}>
          Edit course
        </Button>
        {userId !== undefined && userId === ownerId && <DeleteCourseButton />}
      </Stack>
    </>
  );
}

export default CourseActionsSection;

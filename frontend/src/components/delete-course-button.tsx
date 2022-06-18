import { Button } from "@mantine/core";
import { MdDeleteForever } from "react-icons/md";

function DeleteCourseButton() {
  return (
    <Button color="red" leftIcon={<MdDeleteForever />}>
      Delete course
    </Button>
  );
}

export default DeleteCourseButton;

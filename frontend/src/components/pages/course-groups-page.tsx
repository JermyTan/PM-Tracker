import { Link, useParams } from "react-router-dom";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { Text } from "@mantine/core";
import { useGetSingleCourseQuery } from "../../redux/services/courses-api";

function CourseGroupPage() {
  const { courseId } = useParams();
  const { data: course } = useGetSingleCourseQuery(courseId ?? skipToken);

  return (
    <>
      Course members and groups
      <div>
        <Link to="../milestones">milestones</Link>
      </div>
      <div>
        <Link to="../details">details</Link>
      </div>
      <Text sx={{ whiteSpace: "break-spaces" }}>
        {JSON.stringify(course, null, 4)}
      </Text>
    </>
  );
}

export default CourseGroupPage;

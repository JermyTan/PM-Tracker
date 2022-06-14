import { ReactNode } from "react";
import { useParams } from "react-router-dom";

type Props = {
  children: ReactNode;
};

function CoursePageLayout({ children }: Props) {
  const { courseId } = useParams();

  // TODO: use courseId to pull data

  console.log(courseId);
  return (
    <div>
      <h1>Course page layout</h1>
      {children}
    </div>
  );
}

export default CoursePageLayout;

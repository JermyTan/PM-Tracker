import { Link } from "react-router-dom";

function CourseDetailsPage() {
  return (
    <div>
      Course details
      <div>
        <Link to="../milestones">milestones</Link>
      </div>
      <div>
        <Link to="../groups">groups</Link>
      </div>
    </div>
  );
}

export default CourseDetailsPage;

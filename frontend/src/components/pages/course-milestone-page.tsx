import { Link } from "react-router-dom";

function CourseMilestonePage() {
  return (
    <div>
      Course milestones
      <div>
        <Link to="../groups">groups</Link>
      </div>
      <div>
        <Link to="../details">details</Link>
      </div>
    </div>
  );
}

export default CourseMilestonePage;

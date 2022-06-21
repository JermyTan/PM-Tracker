import { skipToken } from "@reduxjs/toolkit/query/react";
import { ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useGetSingleCourseQueryState } from "../redux/services/courses-api";
import { Role } from "../types/courses";

type Props = {
  children: ReactNode;
  allowedRoles: Role[];
  fallback?: ReactNode;
};

function RoleRestrictedWrapper({
  children,
  allowedRoles,
  fallback = null,
}: Props) {
  const { courseId } = useParams();
  const { role } = useGetSingleCourseQueryState(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({ role: course?.role }),
  });

  return <>{role && allowedRoles.includes(role) ? children : fallback}</>;
}

export default RoleRestrictedWrapper;

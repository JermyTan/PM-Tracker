import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useAppSelector } from "../redux/hooks";
import { useGetSingleCourseQueryState } from "../redux/services/courses-api";
import { roleToPropertiesMap, Role } from "../types/courses";
import { AccountType } from "../types/users";
import useGetCourseId from "./use-get-course-id";

export default function useGetCoursePermissions() {
  const { accountType, id } = useAppSelector(({ currentUser }) => ({
    accountType: currentUser?.user?.accountType,
    id: currentUser?.user?.id,
  }));
  const courseId = useGetCourseId();
  const { course } = useGetSingleCourseQueryState(courseId ?? skipToken, {
    selectFromResult: ({ data: course }) => ({ course }),
  });
  const canCreate =
    accountType !== undefined &&
    [AccountType.Educator, AccountType.Admin].includes(accountType);

  if (!course) {
    return {
      canAccess: false,
      canAccessFullDetails: false,
      canModify: false,
      canDelete: false,
      canCreate,
    };
  }

  const canAccessFullDetails = roleToPropertiesMap[
    Role.Instructor
  ].permissionRoles.includes(course.role);
  const canAccess = canAccessFullDetails || course.isPublished;
  const canModify = roleToPropertiesMap[Role.CoOwner].permissionRoles.includes(
    course.role,
  );
  const canDelete = course.owner.id === id;

  return {
    canAccessFullDetails,
    canAccess,
    canModify,
    canDelete,
    canCreate,
  };
}

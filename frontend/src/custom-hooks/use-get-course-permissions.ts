import { skipToken } from "@reduxjs/toolkit/dist/query";
import { useGetSingleCourseQueryState } from "../redux/services/courses-api";
import { roleToPropertiesMap, Role } from "../types/courses";
import { AccountType } from "../types/users";
import useGetCourseId from "./use-get-course-id";
import useGetCurrentUserAccountType from "./use-get-current-user-account-type";
import useGetCurrentUserId from "./use-get-current-user-id";

export default function useGetCoursePermissions() {
  const accountType = useGetCurrentUserAccountType();
  const userId = useGetCurrentUserId();
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
  const canDelete = course.owner.id === userId;

  return {
    canAccessFullDetails,
    canAccess,
    canModify,
    canDelete,
    canCreate,
  };
}

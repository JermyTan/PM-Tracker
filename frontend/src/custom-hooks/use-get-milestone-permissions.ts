import { INSTRUCTOR_PERMISSION_ROLES, Role } from "../types/courses";
import { MilestoneData } from "../types/milestones";
import useGetCurrentUserRole from "./use-get-current-user-role";

export default function useGetMilestonePermissions(milestone?: MilestoneData) {
  const role = useGetCurrentUserRole();
  const canCreate =
    role !== undefined && INSTRUCTOR_PERMISSION_ROLES.includes(role);

  if (!milestone) {
    return {
      canAccess: false,
      canModify: false,
      canDelete: false,
      canCreate,
    };
  }

  const { startDateTime, isPublished } = milestone;

  const canAccess =
    role !== Role.Student || (isPublished && startDateTime <= Date.now());
  const canModify = canCreate;
  const canDelete = canModify;

  return {
    canAccess,
    canModify,
    canDelete,
    canCreate,
  };
}

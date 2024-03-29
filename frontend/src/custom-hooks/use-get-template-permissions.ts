import { Role, roleToPropertiesMap } from "../types/courses";
import { TemplateData } from "../types/templates";
import useGetCurrentUserRole from "./use-get-current-user-role";

export default function useGetTemplatePermissions(template?: TemplateData) {
  const role = useGetCurrentUserRole();
  const canCreate =
    role !== undefined &&
    roleToPropertiesMap[Role.Instructor].permissionRoles.includes(role);
  const canManage = canCreate;

  if (!template) {
    return {
      canManage,
      canAccess: false,
      canModify: false,
      canDelete: false,
      canCreate,
    };
  }

  const { isPublished } = template;

  const canAccess = role !== Role.Student || isPublished;
  const canModify = canCreate;
  const canDelete = canModify;

  return {
    canManage,
    canAccess,
    canModify,
    canDelete,
    canCreate,
  };
}

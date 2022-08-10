import { MilestoneData } from "../types/milestones";

export function checkIsMilestoneOpen(milestone?: MilestoneData) {
  if (!milestone) {
    return false;
  }

  const { startDateTime, endDateTime } = milestone;
  const now = Date.now();

  return startDateTime <= now && (endDateTime === null || now <= endDateTime);
}

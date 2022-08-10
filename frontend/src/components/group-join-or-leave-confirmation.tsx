import { Text, Modal, Button, Space, Group } from "@mantine/core";
import { capitalCase } from "change-case";
import { usePatchCourseGroupMutation } from "../redux/services/groups-api";
import { CourseData } from "../types/courses";
import { GroupData, GroupPatchAction, GroupPatchData } from "../types/groups";
import { useResolveError } from "../utils/error-utils";
import toastUtils from "../utils/toast-utils";

type Props = {
  course?: CourseData;
  group?: GroupData;
  action: GroupPatchAction.Join | GroupPatchAction.Leave;
  onSuccess?: () => void;
};

function GroupJoinOrLeaveConfirmation({
  course,
  group,
  action,
  onSuccess,
}: Props) {
  const [joinOrLeaveGroup, { isLoading }] = usePatchCourseGroupMutation();

  const courseId = course?.id;
  const groupId = group?.id;

  const { resolveError } = useResolveError();

  // TODO: use a library?
  const actionLowerCase = action.toLowerCase();
  const actionCapitalized = capitalCase(action);
  const actionPastTense = action === GroupPatchAction.Join ? "joined" : "left";
  const oppositeActionLowerCase =
    action === GroupPatchAction.Join
      ? GroupPatchAction.Leave.toLowerCase()
      : actionLowerCase;

  const onJoinOrLeaveGroup = async () => {
    if (isLoading || courseId === undefined || groupId === undefined) {
      return;
    }

    const groupPatchData: GroupPatchData = {
      action,
      payload: {
        userId: null,
      },
    };

    try {
      await joinOrLeaveGroup({ ...groupPatchData, courseId, groupId }).unwrap();

      toastUtils.success({
        message: `You have successfully ${actionPastTense} the group${
          group ? ` "${group.name}"` : ""
        }.`,
      });

      onSuccess?.();
    } catch (error) {
      resolveError(error);
    }
  };

  return (
    <>
      <Text size="sm">
        Are you sure you want to {action.toLowerCase()} the group
        {group ? ` "${group.name}"` : ""}?
        <br />
        <strong>
          Once you {actionLowerCase} the group, you can no longer{" "}
          {oppositeActionLowerCase} it.
        </strong>
      </Text>
      <Space h="md" />
      <Group position="right">
        <Button color="gray" onClick={onSuccess}>
          Cancel
        </Button>
        <Button onClick={onJoinOrLeaveGroup} loading={isLoading}>
          {actionCapitalized} group
        </Button>
      </Group>
    </>
  );
}

export default GroupJoinOrLeaveConfirmation;

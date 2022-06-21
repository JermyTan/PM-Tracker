import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Group, Stack } from "@mantine/core";
import { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { z } from "zod";
import { NAME } from "../constants";

import { useRenameCourseGroupMutation } from "../redux/services/groups-api";
import { Course } from "../types/courses";
import { GroupPatchAction, GroupSummaryView } from "../types/groups";
import { useResolveError } from "../utils/error-utils";
import { handleSubmitForm } from "../utils/form-utils";
import toastUtils from "../utils/toast-utils";
import TextField from "./text-field";

type Props = {
  course?: Course;
  group?: GroupSummaryView;
  onSuccess?: () => void;
};

const schema = z.object({
  [NAME]: z.string().trim().min(1, "Please enter a group name"),
});

type CourseGroupRenameProps = z.infer<typeof schema>;

function RenameGroupForm({ group, course, onSuccess }: Props) {
  const [renameGroup, { isLoading }] = useRenameCourseGroupMutation();

  const methods = useForm<CourseGroupRenameProps>({
    resolver: zodResolver(schema),
    defaultValues: { [NAME]: `${group ? group?.name : ""}` },
  });
  const resolveError = useResolveError();
  const renameFormRef = useRef<HTMLFormElement>(null);

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onRenameCourseGroup = async (formData: CourseGroupRenameProps) => {
    const groupId = group?.id;
    const courseId = course?.id;

    if (
      courseId === undefined ||
      groupId === undefined ||
      isLoading ||
      isSubmitting
    ) {
      return;
    }

    const parsedData = schema.parse(formData);

    const renameData = {
      action: GroupPatchAction.Modify,
      payload: {
        name: parsedData[NAME],
      },
    };

    await renameGroup({ ...renameData, courseId, groupId }).unwrap();

    toastUtils.success({ message: "Succesfully renamed group." });
    onSuccess?.();
  };

  const onConfirmSaveChanges = () => {
    const form = renameFormRef.current;
    if (!form) {
      return;
    }
    form.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true }),
    );
  };

  return (
    <Stack>
      <FormProvider {...methods}>
        <form
          autoComplete="off"
          ref={renameFormRef}
          onSubmit={handleSubmitForm(
            handleSubmit(onRenameCourseGroup),
            resolveError,
          )}
        >
          <TextField name={NAME} required />
        </form>
      </FormProvider>
      <Group>
        <Button
          onClick={onConfirmSaveChanges}
          disabled={isSubmitting}
          loading={isSubmitting}
        >
          Save changes
        </Button>
      </Group>
    </Stack>
  );
}

export default RenameGroupForm;

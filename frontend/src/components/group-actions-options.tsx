import { zodResolver } from "@hookform/resolvers/zod";
import { Menu } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useRef } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
import { z } from "zod";
import { NAME } from "../constants";

import { useRenameCourseGroupMutation } from "../redux/services/groups-api";
import { Course } from "../types/courses";
import { GroupPatchAction, GroupSummaryView } from "../types/groups";
import { useResolveError } from "../utils/error-utils";
import { handleSubmitForm } from "../utils/form-utils";
import TextField from "./text-field";

type Props = {
  hidden: boolean;
  course?: Course;
  group?: GroupSummaryView;
};

const schema = z.object({
  [NAME]: z.string().trim().min(1, "Please enter a group name"),
});

type CourseGroupRenameProps = z.infer<typeof schema>;

function RenameGroupOption({ hidden, group, course }: Props) {
  const modals = useModals();
  const [renameGroup, { isLoading }] = useRenameCourseGroupMutation();

  const methods = useForm<CourseGroupRenameProps>({
    resolver: zodResolver(schema),
    defaultValues: { [NAME]: `${group ? group?.name : ""}` },
  });
  const resolveError = useResolveError();
  const renameFormRef = useRef<HTMLFormElement>(null);

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  console.log("error", errors[NAME]);

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

    const renameData = {
      action: GroupPatchAction.Modify,
      payload: {
        name: formData[NAME],
      },
    };

    await renameGroup({ ...renameData, courseId, groupId }).unwrap();
  };

  const openRenameGroupModal = () =>
    modals.openConfirmModal({
      title: "Rename group",
      closeButtonLabel: "Cancel renaming group",
      centered: true,
      closeOnConfirm: false,
      children: (
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
      ),
      labels: { confirm: "Save changes", cancel: "Cancel" },
      confirmProps: { color: "green", loading: isLoading },
      onConfirm: () => {
        const form = renameFormRef.current;
        console.log(form);
        if (!form) {
          return;
        }

        console.log("hello");
        console.log(form.checkValidity());
        console.log(form.reportValidity());
        form.dispatchEvent(
          new Event("submit", { cancelable: true, bubbles: true }),
        );
      },
    });

  return (
    <Menu.Item
      icon={<FaEdit size={14} />}
      hidden={hidden}
      onClick={openRenameGroupModal}
    >
      Rename group
    </Menu.Item>
  );
}

export default RenameGroupOption;

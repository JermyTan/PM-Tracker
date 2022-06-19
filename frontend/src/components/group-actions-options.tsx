import { zodResolver } from "@hookform/resolvers/zod";
import { Menu } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { FormProvider, useForm } from "react-hook-form";
import { FaEdit } from "react-icons/fa";
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

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onRenameCourseGroup = async (formData: CourseGroupRenameProps) => {
    const groupId = group?.id;
    const courseId = course?.id;

    console.log("onRenameCourseGroup");
    if (
      courseId === undefined ||
      groupId === undefined ||
      isLoading ||
      isSubmitting
    ) {
      return;
    }

    console.log("send API req");

    const renameData = {
      action: GroupPatchAction.Modify,
      payload: {
        name: formData[NAME],
      },
    };

    await renameGroup({ ...renameData, courseId, groupId }).unwrap();

    toastUtils.success({
      message: "Successfully renamed group",
    });
  };

  // TODO: Fix this issue
  const openRenameGroupModal = () =>
    modals.openConfirmModal({
      title: "Rename group",
      closeButtonLabel: "Cancel renaming group",
      centered: true,
      children: (
        <FormProvider {...methods}>
          <TextField name={NAME} />
        </FormProvider>
      ),
      labels: { confirm: "Save changes", cancel: "Cancel" },
      confirmProps: { color: "green", loading: isLoading },
      onConfirm: () => {
        console.log("SUBMIT");
        handleSubmitForm(handleSubmit(onRenameCourseGroup), resolveError);
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

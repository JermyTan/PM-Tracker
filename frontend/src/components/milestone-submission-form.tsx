import { zodResolver } from "@hookform/resolvers/zod";
import { Stack, Title, Text } from "@mantine/core";
import { FormProvider, useFieldArray, useForm } from "react-hook-form";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import { useGetSubmissionsQuery } from "../redux/services/submissions-api";

import { TemplateData } from "../types/templates";
import { useResolveError } from "../utils/error-utils";
import { handleSubmitForm } from "../utils/form-utils";
import SubmissionTypeIconLabel from "./submission-type-icon-label";

type Props = {
  milestoneTemplate: TemplateData;
};

function MilestoneSubmissionForm({ milestoneTemplate }: Props) {
  const { name, description, submissionType, formFieldData } =
    milestoneTemplate;
  const { resolveError } = useResolveError({ name: "milestone-template-form" });
  const methods = useForm({
    // resolver: zodResolver(schema),
    // defaultValues,
  });
  const { control, handleSubmit } = methods;
  const { fields } = useFieldArray({
    control, // control props comes from useForm (optional: if you are using FormContext)
    name: "test", // unique name for your Field Array
  });

  const courseId = useGetCourseId() ?? 0;
  const { data } = useGetSubmissionsQuery({
    courseId,
  });
  console.log(data);

  const onSubmit = () => {};

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmitForm(handleSubmit(onSubmit), resolveError)}
        autoComplete="off"
      >
        <Stack>
          <Stack spacing={2}>
            <Title order={4}>{name}</Title>
            <Text size="sm" color="dimmed">
              <SubmissionTypeIconLabel submissionType={submissionType} />
            </Text>
            <Text size="sm">{description}</Text>
          </Stack>
        </Stack>
      </form>
    </FormProvider>
  );
}

export default MilestoneSubmissionForm;

import { forwardRef, Ref, useImperativeHandle, useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Stack,
  Title,
  Text,
  Button,
  Group,
  Alert,
  ButtonProps,
  ThemeIcon,
  Tooltip,
  Loader,
  SelectItem,
} from "@mantine/core";
import { GoDashboard } from "react-icons/go";
import { FaInfo } from "react-icons/fa";
import { MdGroups } from "react-icons/md";
import {
  FormProvider,
  useFieldArray,
  useForm,
  UseFormReset,
} from "react-hook-form";
import {
  FORM_RESPONSE_DATA,
  GROUP_ID,
  IS_DRAFT,
  RESPONSE,
  SUBMISSION_TYPE,
} from "../constants";
import {
  FormResponseField,
  formResponseFieldSchema,
  SubmissionViewData,
} from "../types/submissions";
import { FormField, FormFieldType, SubmissionType } from "../types/templates";
import { getErrorMessage, useResolveError } from "../utils/error-utils";
import { handleSubmitForm } from "../utils/form-utils";
import SubmissionTypeIconLabel from "./submission-type-icon-label";
import FormFieldRenderer from "./form-field-renderer";
import TextViewer from "./text-viewer";
import toastUtils from "../utils/toast-utils";
import { useGetSubmissionCommentCountQuery } from "../redux/services/comments-api";
import useGetCourseId from "../custom-hooks/use-get-course-id";
import useGetSubmissionId from "../custom-hooks/use-get-submission-id";
import SwitchField from "./switch-field";
import SubmissionFormDraftAlert from "./submission-form-draft-alert";
import { useGetCourseGroupsQuery } from "../redux/services/groups-api";
import SelectField from "./select-field";

const schema = z
  .object({
    [IS_DRAFT]: z.boolean(),
    [SUBMISSION_TYPE]: z.nativeEnum(SubmissionType),
    [GROUP_ID]: z.string().nullish(),
    [FORM_RESPONSE_DATA]: z.array(formResponseFieldSchema),
  })
  .superRefine(
    ({ isDraft, submissionType, groupId, formResponseData }, ctx) => {
      if (isDraft) {
        return;
      }

      if (
        submissionType === SubmissionType.Group &&
        typeof groupId !== "string"
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Please select a group",
          path: [GROUP_ID],
        });
      }

      const typedFormResponseData = formResponseData as FormResponseField[];
      typedFormResponseData.forEach((field, index) => {
        switch (field.type) {
          case FormFieldType.Text:
          case FormFieldType.TextArea:
          case FormFieldType.Numeric:
          case FormFieldType.Mcq: {
            const { required, response } = field;

            if (!required || response !== "") {
              return;
            }

            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                field.type === FormFieldType.Mcq
                  ? "Please select an option"
                  : "This field is required",
              path: [FORM_RESPONSE_DATA, index, RESPONSE],
            });
            return;
          }
          case FormFieldType.Mrq: {
            const { required, response, choices } = field;

            if (!required || response.length > 0) {
              return;
            }

            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                choices.length === 1
                  ? "Please check the option"
                  : "Please select at least 1 option",
              path: [FORM_RESPONSE_DATA, index, RESPONSE],
            });
          }
        }
      });
    },
  );

type SubmissionFormProps = z.infer<typeof schema>;

export type SubmissionFormData = Omit<
  SubmissionFormProps,
  typeof GROUP_ID | typeof FORM_RESPONSE_DATA
> & {
  [GROUP_ID]: string | null;
  [FORM_RESPONSE_DATA]: FormResponseField[];
};

type SubmissionFormHandler = {
  reset: UseFormReset<SubmissionFormProps>;
};

type Props = {
  defaultValues: SubmissionViewData;
  readOnly?: boolean;
  testMode?: boolean;
  withComments?: boolean;
  onSubmit?: (formData: SubmissionFormData) => Promise<unknown>;
  submitButtonProps?: ButtonProps;
};

function SubmissionForm(
  {
    defaultValues,
    readOnly,
    testMode,
    withComments,
    onSubmit: handleOnSubmit,
    submitButtonProps,
  }: Props,
  ref: Ref<SubmissionFormHandler>,
) {
  const {
    name,
    description,
    submissionType,
    isDraft,
    group,
    formResponseData,
  } = defaultValues;
  const isGroupRequired = submissionType === SubmissionType.Group;
  const canSelectGroup = submissionType !== SubmissionType.Individual;
  const methods = useForm<SubmissionFormProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      isDraft,
      submissionType,
      groupId: group === null ? null : `${group.id}`,
      formResponseData,
    },
  });
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;
  useImperativeHandle(ref, () => ({ reset }), [reset]);
  const courseId = useGetCourseId();
  const submissionId = useGetSubmissionId();
  const { commentCountError } = useGetSubmissionCommentCountQuery(
    !withComments || courseId === undefined || submissionId === undefined
      ? skipToken
      : { courseId, submissionId },
    {
      selectFromResult: ({ error: commentCountError }) => ({
        commentCountError,
      }),
    },
  );
  useResolveError({ error: commentCountError, name: "submission-form" });

  const { groups, isLoadingGroups, courseGroupsError } =
    useGetCourseGroupsQuery(
      courseId === undefined || !canSelectGroup
        ? skipToken
        : { courseId, me: true },
      {
        selectFromResult: ({
          data: groups,
          isLoading: isLoadingGroups,
          error: courseGroupsError,
        }) => ({
          groups,
          isLoadingGroups,
          courseGroupsError,
        }),
      },
    );
  const groupOptions: SelectItem[] = useMemo(() => {
    const options =
      groups?.map(({ id, name }) => ({ label: name, value: `${id}` })) ?? [];

    if (group?.id === undefined) {
      return options;
    }

    const groupId = `${group.id}`;

    if (options.some(({ value }) => value === groupId)) {
      return options;
    }

    options.push({ label: group.name, value: groupId });

    return options;
  }, [groups, group]);

  const { fields } = useFieldArray({
    control,
    name: FORM_RESPONSE_DATA,
  });

  const { resolveError } = useResolveError({
    name: "submission-form",
  });

  const onSubmit = async (rawFormData: SubmissionFormProps) => {
    if (testMode) {
      toastUtils.info({
        title: "Test mode",
        message: rawFormData.isDraft
          ? "No input validation is run since this form is in draft state. This form can be submitted."
          : "Form inputs are successfully validated and can be submitted.",
      });
      return;
    }

    if (isSubmitting || readOnly) {
      return;
    }

    const { isDraft, groupId, submissionType, formResponseData } = rawFormData;
    const formData: SubmissionFormData = {
      isDraft,
      groupId: groupId ?? null,
      submissionType,
      formResponseData: formResponseData as FormResponseField[],
    };

    await handleOnSubmit?.(formData);
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmitForm(handleSubmit(onSubmit), resolveError)}
        autoComplete="off"
      >
        <Stack spacing={32}>
          <Stack>
            {testMode && (
              <Alert
                p="xs"
                color="orange"
                icon={<GoDashboard />}
                title="Test mode"
              >
                This form is in test mode. You can test this form by filling in
                the fields. Validations, such as enforcing non-empty inputs for
                required fields, will be run. No actual submission will be made
                in test mode.
              </Alert>
            )}

            <Stack spacing={2}>
              <Title order={4}>
                <TextViewer inherit overflowWrap>
                  {name}
                </TextViewer>
              </Title>
              <Text size="sm" color="dimmed">
                <SubmissionTypeIconLabel submissionType={submissionType} />
              </Text>
              {description && (
                <TextViewer
                  size="sm"
                  preserveWhiteSpace
                  overflowWrap
                  withLinkify
                >
                  {description}
                </TextViewer>
              )}
            </Stack>
          </Stack>

          <SubmissionFormDraftAlert name={IS_DRAFT} />

          <SwitchField
            name={IS_DRAFT}
            label={
              <Group spacing={4}>
                <Text size="sm">Draft</Text>
                <Tooltip
                  label={
                    <Text size="xs">
                      Remember to <strong>save</strong> after toggling for the
                      change to take effect. This state is revertable till the
                      deadline, if any, is over.
                    </Text>
                  }
                  withArrow
                  position="top-start"
                  transition="pop-top-left"
                  transitionDuration={300}
                  multiline
                  width={220}
                >
                  <ThemeIcon color="gray" size="xs" radius="xl">
                    <FaInfo size={7} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
            }
            disabled={readOnly}
          />

          {canSelectGroup && (
            <SelectField
              label="Group"
              data={groupOptions}
              name={GROUP_ID}
              rightSection={isLoadingGroups ? <Loader size="xs" /> : undefined}
              disabled={isLoadingGroups || readOnly}
              error={getErrorMessage(courseGroupsError)}
              required={isGroupRequired}
              placeholder={`Please select a group${
                isGroupRequired ? "" : " (optional)"
              }`}
              clearable={!isGroupRequired}
              icon={<MdGroups />}
            />
          )}

          {fields.map(({ id, ...field }, index) => (
            <FormFieldRenderer
              key={id}
              name={`${FORM_RESPONSE_DATA}.${index}.${RESPONSE}`}
              index={index}
              formField={field as FormField}
              readOnly={readOnly}
              withComments={withComments}
            />
          ))}

          {!readOnly && (
            <Group position="right">
              <Button
                {...{ children: testMode ? "Test" : "Save" }}
                {...submitButtonProps}
                loading={isSubmitting}
                type="submit"
              />
            </Group>
          )}
        </Stack>
      </form>
    </FormProvider>
  );
}

export default forwardRef(SubmissionForm);

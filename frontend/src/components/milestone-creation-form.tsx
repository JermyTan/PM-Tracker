import { zodResolver } from "@hookform/resolvers/zod";
import {
  Group,
  Stack,
  ThemeIcon,
  Title,
  Tooltip,
  Text,
  Button,
} from "@mantine/core";
import { isSameDate } from "@mantine/dates";
import { FormProvider, useForm } from "react-hook-form";
import { FaQuestion } from "react-icons/fa";
import { z } from "zod";
import {
  DATE_MONTH_NAME_FORMAT,
  DESCRIPTION,
  END_DATE,
  END_TIME,
  IS_PUBLISHED,
  NAME,
  START_DATE,
  START_TIME,
} from "../constants";
import { useGetCourseId } from "../custom-hooks/use-get-course-id";
import { useGetMilestoneAlias } from "../custom-hooks/use-get-milestone-alias";
import { useCreateMilestoneMutation } from "../redux/services/milestones-api";
import { emptySelector } from "../redux/utils";
import { useResolveError } from "../utils/error-utils";
import { handleSubmitForm } from "../utils/form-utils";
import toastUtils from "../utils/toast-utils";
import {
  getEndOfDate,
  getStartOfDate,
  mergeDateTime,
} from "../utils/transform-utils";
import DateField from "./date-field";
import SwitchField from "./switch-field";
import TextField from "./text-field";
import TextareaField from "./textarea-field";
import TimeField from "./time-field";

const schema = z
  .object({
    [NAME]: z.string().trim().min(1, "Please enter a name"),
    [DESCRIPTION]: z.string().trim(),
    [START_DATE]: z.date({ invalid_type_error: "Please enter a start date" }),
    [START_TIME]: z.date({ invalid_type_error: "Please enter a start time" }),
    [END_DATE]: z.date().nullable(),
    [END_TIME]: z.date().nullable(),
    [IS_PUBLISHED]: z.boolean(),
  })
  .refine(
    ({ startDate, startTime, endDate, endTime }) => {
      if (endDate === null || endTime === null) {
        return true;
      }

      const startDateTime = getStartOfDate(
        mergeDateTime(startDate, startTime),
        "minute",
      );
      const endDateTime = getEndOfDate(
        mergeDateTime(endDate, endTime),
        "minute",
      );

      return startDateTime <= endDateTime;
    },
    ({ startDate, endDate }) =>
      endDate !== null && isSameDate(startDate, endDate)
        ? {
            message: "End time cannot be before start time",
            path: [END_TIME],
          }
        : {
            message: "End date cannot be before start date",
            path: [END_DATE],
          },
  );

type MilestoneCreationFormProps = Omit<
  z.infer<typeof schema>,
  typeof START_DATE | typeof START_TIME
> & {
  [START_DATE]: Date | null;
  [START_TIME]: Date | null;
};

const DEFAULT_VALUES: MilestoneCreationFormProps = {
  name: "",
  description: "",
  startDate: null,
  startTime: null,
  endDate: null,
  endTime: null,
  isPublished: false,
};

type Props = {
  onSuccess?: () => void;
};

function MilestoneCreationForm({ onSuccess }: Props) {
  const courseId = useGetCourseId();
  const { milestoneAlias, capitalizedMilestoneAlias } = useGetMilestoneAlias();
  const methods = useForm<MilestoneCreationFormProps>({
    resolver: zodResolver(schema),
    defaultValues: DEFAULT_VALUES,
  });
  const { resolveError } = useResolveError({ name: "milestone-creation-form" });
  const [createMilestone] = useCreateMilestoneMutation({
    selectFromResult: emptySelector,
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (formData: MilestoneCreationFormProps) => {
    if (isSubmitting || courseId === undefined) {
      return;
    }

    const { startDate, startTime, endDate, endTime, ...rest } = formData;

    if (startDate === null || startTime === null) {
      return;
    }

    const startDateTime = getStartOfDate(
      mergeDateTime(startDate, startTime),
      "minute",
    ).getTime();
    const endDateTime =
      endDate === null || endTime === null
        ? null
        : getEndOfDate(mergeDateTime(endDate, endTime), "minute").getTime();

    const data: Parameters<typeof createMilestone>[0] = {
      courseId,
      startDateTime,
      endDateTime,
      ...rest,
    };

    await createMilestone(data).unwrap();

    toastUtils.success({
      message: `The new ${milestoneAlias} has been created successfully.`,
    });
    onSuccess?.();
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={handleSubmitForm(handleSubmit(onSubmit), resolveError)}
        autoComplete="off"
      >
        <Stack spacing={32}>
          <Stack>
            <Title order={4}>{capitalizedMilestoneAlias} Details</Title>

            <TextField
              name={NAME}
              label={`${capitalizedMilestoneAlias} name`}
              autoFocus
              data-autofocus
              required
            />

            <TextareaField
              name={DESCRIPTION}
              label={`${capitalizedMilestoneAlias} description`}
            />

            <Stack spacing={6}>
              <Group noWrap grow align="flex-start">
                <DateField
                  name={START_DATE}
                  inputFormat={DATE_MONTH_NAME_FORMAT}
                  label="Start date"
                  required
                  clearable={false}
                />
                <TimeField
                  name={START_TIME}
                  label="Start time"
                  format="12"
                  required
                  clearable
                />
              </Group>

              <Text size="xs" color="dimmed">
                Students can only access this {milestoneAlias} after the start
                date/time.
              </Text>
            </Stack>

            <Stack spacing={6}>
              <Group noWrap grow align="flex-start">
                <DateField
                  name={END_DATE}
                  inputFormat={DATE_MONTH_NAME_FORMAT}
                  label="End date"
                  clearable
                />
                <TimeField
                  name={END_TIME}
                  label="End time"
                  format="12"
                  clearable
                />
              </Group>
              <Text size="xs" color="dimmed">
                If specified, students cannot make submissions after the end
                date/time.
              </Text>
            </Stack>

            <Group position="apart">
              <Group spacing={4}>
                <Text<"label">
                  size="sm"
                  htmlFor={IS_PUBLISHED}
                  component="label"
                >
                  Publish {milestoneAlias}
                </Text>
                <Tooltip
                  label={
                    <Text size="xs">
                      Students can view this {milestoneAlias}.
                    </Text>
                  }
                  withArrow
                  placement="start"
                  transition="pop-top-left"
                  transitionDuration={300}
                  wrapLines
                  width={200}
                >
                  <ThemeIcon color="gray" size="xs" radius="xl">
                    <FaQuestion size={7} />
                  </ThemeIcon>
                </Tooltip>
              </Group>
              <SwitchField
                name={IS_PUBLISHED}
                id={IS_PUBLISHED}
                onLabel="Yes"
                offLabel="No"
                size="md"
              />
            </Group>
          </Stack>

          <Group position="right">
            <Button
              disabled={isSubmitting}
              loading={isSubmitting}
              type="submit"
            >
              Create
            </Button>
          </Group>
        </Stack>
      </form>
    </FormProvider>
  );
}

export default MilestoneCreationForm;

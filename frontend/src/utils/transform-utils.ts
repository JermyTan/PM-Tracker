import arraySort from "array-sort";
import papaparse from "papaparse";
import dayjs from "dayjs";
import {
  COMMENTS,
  COMMENT_HAS_BEEN_DELETED,
  CREATED_AT,
  DATE_TIME_MONTH_NAME_FORMAT,
  EX_COURSE_MEMBER,
  UNKNOWN_USER,
} from "../constants";
import type {
  SubmissionSummaryData,
  SubmissionDataWithComments,
  SubmissionViewData,
} from "../types/submissions";
import { FormFieldType } from "../types/enums";
import type { TemplateData } from "../types/templates";
import type { SubmissionCommentData } from "../types/comments";
import { roleToPropertiesMap } from "../types/courses";

// Reference: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/array-sort/index.d.ts
type Comparator<T> = (a: T, b: T) => number;
type ComparisonArg<T> = string | Comparator<T>;
type ComparisonArgs<T> = ComparisonArg<T> | Array<ComparisonArg<T>>;

export function sort<T>(
  array: T[],
  {
    key,
    reverse = false,
  }: { key?: ComparisonArgs<T> | undefined; reverse?: boolean } = {},
) {
  return arraySort<T>([...array], key, { reverse });
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return !Array.isArray(value) && typeof value === "object" && value !== null;
}

export function isStringOrArray(
  value: unknown,
): value is string | (string | number)[] {
  return (
    typeof value === "string" ||
    (Array.isArray(value) &&
      value.every((v) => typeof v === "string" || typeof v === "number"))
  );
}

export function isSubmissionDataWithComments(
  value: SubmissionSummaryData | SubmissionDataWithComments,
): value is SubmissionDataWithComments {
  return COMMENTS in value;
}

export function trim<T>(value: T) {
  return typeof value === "string" ? value.trim() : value;
}

export function capitalizeFirstLetter(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function deepTrim<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => deepTrim(item)) as unknown as T;
  }

  if (isRecord(value)) {
    return Object.keys(value).reduce((all, key) => {
      all[key] = deepTrim(value[key]);
      return all;
    }, {} as Record<string, unknown>) as T;
  }

  return trim(value) as T;
}

export function sanitizeArray(
  strings: string[],
  options: { unique: boolean } = { unique: true },
): string[] {
  const { unique } = options;
  if (unique) {
    return Array.from(new Set(strings.map((s) => s.trim()).filter((s) => s)));
  }
  return strings.map((s) => s.trim()).filter((s) => s);
}

export function sanitizeObject<T>(
  object: Record<string, unknown>,
  defaultValue?: T,
) {
  const newObject: Record<string, unknown> = {};

  Object.entries(object).forEach(([key, value]) => {
    if (value === undefined) {
      return;
    }

    newObject[key] = value;
  });

  return Object.keys(newObject).length === 0 ? defaultValue : newObject;
}

export function displayDateTime(
  inputDateTime: string | number | Date,
  dateTimeFormat?: string,
): string {
  try {
    const dateTime = dayjs(
      typeof inputDateTime === "string"
        ? parseInt(inputDateTime, 10)
        : inputDateTime,
    );

    return dateTime.format(dateTimeFormat);
  } catch {
    return "";
  }
}

export function mergeDateTime(date: Date, time: Date) {
  return dayjs(date)
    .hour(time.getHours())
    .minute(time.getMinutes())
    .second(time.getSeconds())
    .millisecond(time.getMilliseconds())
    .toDate();
}

export function getStartOfDate(date: Date, unit: dayjs.OpUnitType) {
  return dayjs(date).startOf(unit).toDate();
}

export function getEndOfDate(date: Date, unit: dayjs.OpUnitType) {
  return dayjs(date).endOf(unit).toDate();
}

export function transformKeys(
  transformFn: (input: string) => string,
  object: Record<string, unknown>,
) {
  const newObject: Record<string, unknown> = {};

  Object.entries(object).forEach(([key, value]) => {
    newObject[transformFn(key)] = value;
  });

  return newObject;
}

export function incrementNameIfNecessary(name: string, nameList: string[]) {
  const nameSet = new Set(nameList);
  let incrementedName = name;

  for (let i = 1; nameSet.has(incrementedName); i += 1) {
    incrementedName = `${name} (${i})`;
  }

  return incrementedName;
}

export function parseToSubmissionCsvFiles(
  submissions: SubmissionDataWithComments[],
): Record<string, Blob> {
  const submissionGroups = sort(submissions, { key: CREATED_AT }).reduce(
    (submissionGroups, submission) => {
      const { name, formResponseData } = submission;
      const groupKey = [
        name,
        ...formResponseData.map((v) =>
          v.type === FormFieldType.TextDisplay ? v.content : v.label,
        ),
      ].join("#");

      submissionGroups.set(groupKey, [
        ...(submissionGroups.get(groupKey) ?? []),
        submission,
      ]);

      return submissionGroups;
    },
    new Map<string, SubmissionDataWithComments[]>(),
  );

  return Array.from(submissionGroups.values()).reduce(
    (csvFiles, submissions) => {
      const { name, formResponseData } = submissions[0];
      const filename = incrementNameIfNecessary(name, Object.keys(csvFiles));

      const formResponseTitles = formResponseData.flatMap((v) => [
        v.type === FormFieldType.TextDisplay ? v.content : v.label,
        "Comments",
      ]);
      const csvFile = new Blob(
        [
          papaparse.unparse({
            fields: [
              "ID",
              "Created at",
              "Created by",
              "Last updated at",
              "Last updated by",
              "Is draft?",
              "Submission group",
              ...formResponseTitles,
            ],
            data: submissions.map(
              ({
                id,
                createdAt,
                updatedAt,
                creator,
                editor,
                isDraft,
                group,
                formResponseData,
                comments,
              }) => {
                const fieldIndexToCommentsMap = comments.reduce(
                  (map, comment) => {
                    map.set(comment.fieldIndex, [
                      ...(map.get(comment.fieldIndex) ?? []),
                      comment,
                    ]);

                    return map;
                  },
                  new Map<number, SubmissionCommentData[]>(),
                );
                const formResponses = formResponseData.flatMap(
                  (responseData, index) => {
                    const response = (() => {
                      if (responseData.type === FormFieldType.TextDisplay) {
                        return undefined;
                      }

                      const { response } = responseData;

                      return Array.isArray(response)
                        ? response.join(" & ")
                        : response;
                    })();

                    const comments = fieldIndexToCommentsMap
                      .get(index)
                      ?.map(
                        ({ content, role, isDeleted, commenter }) =>
                          `${commenter?.name ?? UNKNOWN_USER}\n${
                            role !== null
                              ? roleToPropertiesMap[role].label
                              : EX_COURSE_MEMBER
                          }\n\n${
                            isDeleted ? COMMENT_HAS_BEEN_DELETED : content
                          }\n\n${displayDateTime(
                            createdAt,
                            DATE_TIME_MONTH_NAME_FORMAT,
                          )}\n\n--\n`,
                      );

                    return [response, comments];
                  },
                );

                return [
                  id,
                  createdAt,
                  creator?.name,
                  updatedAt,
                  editor?.name,
                  isDraft,
                  group?.name,
                  ...formResponses,
                ];
              },
            ),
          }),
        ],
        { type: "text/csv;charset=utf-8" },
      );

      csvFiles[filename] = csvFile;

      return csvFiles;
    },
    {} as Record<string, Blob>,
  );
}

export function transformTemplateToSubmissionView({
  template,
  overrides,
}: {
  template?: TemplateData;
  overrides?: Partial<SubmissionViewData>;
}) {
  if (!template) {
    return undefined;
  }

  const { name, description, submissionType, formFieldData } = template;
  const submissionView: SubmissionViewData = {
    name,
    description,
    isDraft: true,
    submissionType,
    creator: null,
    editor: null,
    milestone: null,
    group: null,
    template,
    formResponseData: formFieldData.map((formField) => {
      switch (formField.type) {
        case FormFieldType.TextDisplay:
          return formField;
        case FormFieldType.Mrq:
          return { ...formField, response: [] };
        default:
          return { ...formField, response: "" };
      }
    }),
    ...overrides,
  };

  return submissionView;
}

// export function displayDateTimeRange(
//   inputStartDateTime: string | number | Date,
//   inputEndDateTime: string | number | Date,
// ) {
//   const startDateTime =
//     typeof inputStartDateTime === "string"
//       ? parseInt(inputStartDateTime, 10)
//       : inputStartDateTime;
//   const endDateTime =
//     typeof inputEndDateTime === "string"
//       ? parseInt(inputEndDateTime, 10)
//       : inputEndDateTime;

//   return isSameDay(startDateTime, endDateTime)
//     ? `${displayDateTime(startDateTime, DATE_FORMAT)} ${displayDateTime(
//         startDateTime,
//         TIME_FORMAT,
//       )} - ${displayDateTime(endDateTime, TIME_FORMAT)}`
//     : `${displayDateTime(startDateTime)} - ${displayDateTime(endDateTime)}`;
// }

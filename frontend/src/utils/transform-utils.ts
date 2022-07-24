import arraySort from "array-sort";
import dayjs from "dayjs";

export function isRecord(value: unknown): value is Record<string, unknown> {
  return !Array.isArray(value) && typeof value === "object" && value !== null;
}

export function trim<T>(value: T) {
  return typeof value === "string" ? value.trim() : value;
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

export function sort<T>(
  array: T[],
  {
    key,
    reverse = false,
  }: { key?: Parameters<typeof arraySort>[1]; reverse?: boolean } = {},
) {
  return arraySort([...array], key, { reverse });
}

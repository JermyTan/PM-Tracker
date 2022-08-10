import { Text, TextProps } from "@mantine/core";
import { DATE_TIME_MONTH_NAME_FORMAT } from "../constants";
import { displayDateTime } from "../utils/transform-utils";

type Props<T> = {
  startDateTime: number;
  endDateTime: number | null;
} & Omit<TextProps<T>, "children">;

function MilestoneActivePeriodDisplay<T = "div">({
  startDateTime,
  endDateTime,
  ...props
}: Props<T>) {
  return (
    <Text {...props}>
      <Text inherit>
        Start: {displayDateTime(startDateTime, DATE_TIME_MONTH_NAME_FORMAT)}
      </Text>
      {endDateTime !== null && (
        <Text inherit>
          End: {displayDateTime(endDateTime, DATE_TIME_MONTH_NAME_FORMAT)}
        </Text>
      )}
    </Text>
  );
}

export default MilestoneActivePeriodDisplay;

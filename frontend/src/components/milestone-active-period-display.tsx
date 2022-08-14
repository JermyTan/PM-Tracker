import { Text, TextProps } from "@mantine/core";
import { ComponentPropsWithoutRef, ElementType } from "react";
import { DATE_TIME_MONTH_NAME_FORMAT } from "../constants";
import { displayDateTime } from "../utils/transform-utils";

type Props<C extends ElementType> = Omit<
  TextProps & ComponentPropsWithoutRef<C>,
  "children"
> & { startDateTime: number; endDateTime: number | null };

function MilestoneActivePeriodDisplay<C extends ElementType = "div">({
  startDateTime,
  endDateTime,
  ...props
}: Props<C>) {
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

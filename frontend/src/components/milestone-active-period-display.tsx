import { Text } from "@mantine/core";
import { DATE_TIME_MONTH_NAME_FORMAT } from "../constants";
import { displayDateTime } from "../utils/transform-utils";

type Props = {
  startDateTime: number;
  endDateTime: number | null;
};

function MilestoneActivePeriodDisplay({ startDateTime, endDateTime }: Props) {
  return (
    <div>
      <Text size="sm" weight={500}>
        Start: {displayDateTime(startDateTime, DATE_TIME_MONTH_NAME_FORMAT)}
      </Text>
      {endDateTime !== null && (
        <Text size="sm" weight={500}>
          End: {displayDateTime(endDateTime, DATE_TIME_MONTH_NAME_FORMAT)}
        </Text>
      )}
    </div>
  );
}

export default MilestoneActivePeriodDisplay;

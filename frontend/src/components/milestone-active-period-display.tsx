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
      <Text size="sm">
        Start:{" "}
        <Text<"span"> weight={500} size="sm" component="span">
          {displayDateTime(startDateTime, DATE_TIME_MONTH_NAME_FORMAT)}
        </Text>
      </Text>
      {endDateTime !== null && (
        <Text size="sm">
          End:{" "}
          <Text<"span"> weight={500} size="sm" component="span">
            {displayDateTime(endDateTime, DATE_TIME_MONTH_NAME_FORMAT)}
          </Text>
        </Text>
      )}
    </div>
  );
}

export default MilestoneActivePeriodDisplay;

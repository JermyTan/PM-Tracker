import { DatePicker, DatePickerProps } from "@mantine/dates";
import { useController } from "react-hook-form";

type Props = DatePickerProps & {
  name: string;
};

function DateField({ name, ...props }: Props) {
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  return (
    <DatePicker
      error={error?.message}
      firstDayOfWeek="sunday"
      {...props}
      {...field}
    />
  );
}

export default DateField;

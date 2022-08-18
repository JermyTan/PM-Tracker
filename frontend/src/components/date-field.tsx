import { DatePicker, DatePickerProps } from "@mantine/dates";
import { useController } from "react-hook-form";

type Props = DatePickerProps & {
  name: string;
};

function DateField({ name, required, ...props }: Props) {
  const {
    field,
    fieldState: { error },
  } = useController<{ [name: string]: Date | null }>({ name });

  return (
    <DatePicker
      withAsterisk={required}
      firstDayOfWeek="sunday"
      withinPortal
      {...props}
      error={error?.message}
      {...field}
    />
  );
}

export default DateField;

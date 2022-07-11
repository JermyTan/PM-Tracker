import { DatePicker, DatePickerProps } from "@mantine/dates";
import { useController } from "react-hook-form";

type Props = DatePickerProps & {
  name: string;
};

function DateField({ name, ...props }: Props) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ name });

  return (
    <DatePicker
      error={error?.message}
      {...props}
      onChange={onChange}
      value={value}
      onBlur={onBlur}
      ref={ref}
    />
  );
}

export default DateField;

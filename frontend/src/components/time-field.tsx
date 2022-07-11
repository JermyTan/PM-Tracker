import { TimeInput, TimeInputProps } from "@mantine/dates";
import { useController } from "react-hook-form";

type Props = TimeInputProps & {
  name: string;
};

function TimeField({ name, ...props }: Props) {
  const {
    field: { onChange, onBlur, value, ref },
    fieldState: { error },
  } = useController({ name });

  return (
    <TimeInput
      error={error?.message}
      {...props}
      onChange={onChange}
      value={value}
      onBlur={onBlur}
      ref={ref}
    />
  );
}

export default TimeField;

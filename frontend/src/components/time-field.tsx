import { TimeInput, TimeInputProps } from "@mantine/dates";
import { useController } from "react-hook-form";

type Props = TimeInputProps & {
  name: string;
};

function TimeField({ name, required, ...props }: Props) {
  const {
    field,
    fieldState: { error },
  } = useController<{ [name: string]: Date | null }>({ name });

  return (
    <TimeInput
      withAsterisk={required}
      {...props}
      error={error?.message}
      {...field}
    />
  );
}

export default TimeField;

import { TimeInput, TimeInputProps } from "@mantine/dates";
import { useController } from "react-hook-form";

type Props = TimeInputProps & {
  name: string;
};

function TimeField({ name, ...props }: Props) {
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  return <TimeInput error={error?.message} {...props} {...field} />;
}

export default TimeField;

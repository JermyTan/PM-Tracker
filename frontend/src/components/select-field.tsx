import { Select, SelectProps } from "@mantine/core";
import { useController } from "react-hook-form";

type Props = SelectProps & {
  name: string;
};

function SelectField({ name, required, ...props }: Props) {
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  return (
    <Select
      withAsterisk={required}
      {...props}
      error={error?.message}
      {...field}
    />
  );
}

export default SelectField;

import { Select, SelectProps } from "@mantine/core";
import { useController } from "react-hook-form";

type Props = SelectProps & {
  name: string;
};

function SelectField({ name, ...props }: Props) {
  const {
    field,
    fieldState: { error },
  } = useController({ name });

  return <Select {...props} error={error?.message} {...field} />;
}

export default SelectField;

import { CheckboxGroupProps, Checkbox } from "@mantine/core";
import { useController } from "react-hook-form";

type Props = Omit<CheckboxGroupProps, "children"> & {
  name: string;
  choices: [string, ...string[]];
  readOnly?: boolean;
};

function CheckboxGroupField({
  name,
  choices,
  readOnly,
  required,
  ...props
}: Props) {
  const {
    field: { onChange, ...other },
    fieldState: { error },
  } = useController<{ [name: string]: string[] }>({ name });

  return (
    <Checkbox.Group
      withAsterisk={required}
      {...props}
      error={error?.message}
      {...other}
      // NOTE: html readOnly is not exposed
      // so currently using this hack to make it readOnly
      onChange={readOnly ? undefined : onChange}
    >
      {choices.map((choice, index) => (
        <Checkbox key={`${index}.${choice}`} value={choice} label={choice} />
      ))}
    </Checkbox.Group>
  );
}

export default CheckboxGroupField;

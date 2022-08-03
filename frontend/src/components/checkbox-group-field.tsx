import { CheckboxGroup, CheckboxGroupProps, Checkbox } from "@mantine/core";
import { useController } from "react-hook-form";

type Props = Omit<CheckboxGroupProps, "children"> & {
  name: string;
  choices: [string, ...string[]];
};

function CheckboxGroupField({ name, choices, ...props }: Props) {
  const {
    field,
    fieldState: { error },
  } = useController<{ [name: string]: string[] }>({ name });

  return (
    <CheckboxGroup error={error?.message} {...props} {...field}>
      {choices.map((choice, index) => (
        <Checkbox key={`${index}.${choice}`} value={choice} label={choice} />
      ))}
    </CheckboxGroup>
  );
}

export default CheckboxGroupField;

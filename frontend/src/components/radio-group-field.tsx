import { Radio, RadioGroup, RadioGroupProps } from "@mantine/core";
import { useController } from "react-hook-form";

type Props = Omit<RadioGroupProps, "children"> & {
  name: string;
  choices: [string, ...string[]];
};

function RadioGroupField({ name, choices, ...props }: Props) {
  const {
    field,
    fieldState: { error },
  } = useController<{ [name: string]: string }>({ name });

  return (
    <RadioGroup error={error?.message} {...props} {...field}>
      {choices.map((choice, index) => (
        <Radio key={`${index}.${choice}`} value={choice} label={choice} />
      ))}
    </RadioGroup>
  );
}

export default RadioGroupField;

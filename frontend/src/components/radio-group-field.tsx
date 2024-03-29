import { Radio, RadioGroupProps } from "@mantine/core";
import { useController } from "react-hook-form";

type Props = Omit<RadioGroupProps, "children"> & {
  name: string;
  choices: [string, ...string[]];
  readOnly?: boolean;
};

function RadioGroupField({
  name,
  choices,
  readOnly,
  required,
  ...props
}: Props) {
  const {
    field: { onChange, ...other },
    fieldState: { error },
  } = useController<{ [name: string]: string }>({ name });

  return (
    <Radio.Group
      withAsterisk={required}
      {...props}
      error={error?.message}
      {...other}
      // NOTE: html readOnly is not exposed
      // so currently using this hack to make it readOnly
      onChange={readOnly ? undefined : onChange}
    >
      {choices.map((choice, index) => (
        <Radio key={`${index}.${choice}`} value={choice} label={choice} />
      ))}
    </Radio.Group>
  );
}

export default RadioGroupField;

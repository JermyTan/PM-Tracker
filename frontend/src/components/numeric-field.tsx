import { NumberInputProps, NumberInput } from "@mantine/core";
import { useCallback } from "react";
import { useController } from "react-hook-form";

type Props = NumberInputProps & {
  name: string;
};

function NumericField({ name, required, ...props }: Props) {
  const {
    field: { value, onChange: onHandleChange, ...other },
    fieldState: { error },
  } = useController<{ [name: string]: string }>({ name });

  const numericValue = parseInt(value, 10);

  const onChange = useCallback(
    (value: number | undefined) =>
      onHandleChange(
        value === undefined || Number.isNaN(value) ? "" : `${value}`,
      ),
    [onHandleChange],
  );

  return (
    <NumberInput
      withAsterisk={required}
      {...props}
      error={error?.message}
      value={Number.isNaN(numericValue) ? undefined : numericValue}
      onChange={onChange}
      {...other}
    />
  );
}

export default NumericField;

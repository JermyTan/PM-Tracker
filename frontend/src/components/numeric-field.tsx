import { NumberInputProps, NumberInput } from "@mantine/core";
import { useCallback } from "react";
import { useController } from "react-hook-form";

type Props = NumberInputProps & {
  name: string;
};

function NumericField({ name, ...props }: Props) {
  const {
    field: { value, name: fieldName, ref, onChange: onHandleChange, onBlur },
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
      error={error?.message}
      {...props}
      value={Number.isNaN(numericValue) ? undefined : numericValue}
      onChange={onChange}
      name={fieldName}
      ref={ref}
      onBlur={onBlur}
    />
  );
}

export default NumericField;

import { ReactNode } from "react";
import get from "lodash/get";
import {
  Checkbox,
  CheckboxProps,
  FormControl,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormContext, UseFormRegisterReturn } from "react-hook-form";

type Props = CheckboxProps & {
  name: string;
  children: ReactNode;
  errorMsg?: string;
};

function CheckboxField({
  name,
  isInvalid,
  isRequired,
  children,
  errorMsg,
  ...props
}: Props) {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const error = get(errors, name);

  return (
    <FormControl isInvalid={error || isInvalid}>
      <Checkbox
        {...props}
        isInvalid={error || isInvalid}
        isRequired={isRequired}
        {...register(name, { required: isRequired })}
      >
        {children}
      </Checkbox>
      {(error || isInvalid) && (errorMsg || error?.message) && (
        <FormErrorMessage>{errorMsg ?? error?.message}</FormErrorMessage>
      )}
    </FormControl>
  );
}

export default CheckboxField;

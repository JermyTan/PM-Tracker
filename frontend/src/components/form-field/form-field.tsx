import { HTMLInputTypeAttribute, ReactNode } from "react";
import {
  FormControl,
  FormControlProps,
  Input,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import get from "lodash/get";

type Props = FormControlProps & {
  name: string;
  labelContent?: ReactNode;
  type?: HTMLInputTypeAttribute;
  errorMsg?: string;
  showRequiredIndicator?: boolean;
};

function FormField({
  name,
  labelContent,
  type,
  isInvalid,
  isRequired,
  placeholder,
  errorMsg,
  showRequiredIndicator = true,
  ...props
}: Props) {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const error = get(errors, name);

  return (
    <FormControl
      isInvalid={error || isInvalid}
      isRequired={showRequiredIndicator && isRequired}
      {...props}
    >
      {labelContent && <FormLabel htmlFor={name}>{labelContent}</FormLabel>}
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        required={isRequired}
        {...register(name, { required: isRequired })}
      />
      {error && (errorMsg || error?.message) && (
        <FormErrorMessage>{errorMsg ?? error?.message}</FormErrorMessage>
      )}
    </FormControl>
  );
}

export default FormField;

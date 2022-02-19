import { ReactNode } from "react";
import {
  FormControl,
  type FormControlProps,
  Input,
  FormLabel,
  FormErrorMessage,
  useBoolean,
  InputGroup,
  InputRightElement,
  IconButton,
} from "@chakra-ui/react";
import { useFormContext } from "react-hook-form";
import get from "lodash/get";
import { HiEye, HiEyeOff } from "react-icons/hi";

type Props = FormControlProps & {
  name: string;
  labelContent?: ReactNode;
  errorMsg?: string;
  showRequiredIndicator?: boolean;
  autoComplete: "current-password" | "new-password";
};

function PasswordField({
  name,
  labelContent,
  isInvalid,
  isRequired,
  placeholder,
  errorMsg,
  showRequiredIndicator = true,
  autoComplete,
  ...props
}: Props) {
  const {
    formState: { errors },
    register,
  } = useFormContext();
  const error = get(errors, name);

  const [showPassword, { toggle }] = useBoolean();

  return (
    <FormControl
      isInvalid={error || isInvalid}
      isRequired={showRequiredIndicator && isRequired}
      {...props}
    >
      {labelContent && <FormLabel htmlFor={name}>{labelContent}</FormLabel>}
      <InputGroup>
        <Input
          id={name}
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={isRequired}
          {...register(name, { required: isRequired })}
        />

        <InputRightElement>
          <IconButton
            variant="link"
            aria-label={showPassword ? "Mask password" : "Reveal password"}
            icon={showPassword ? <HiEyeOff /> : <HiEye />}
            onClick={toggle}
          />
        </InputRightElement>
      </InputGroup>

      {error && (errorMsg || error?.message) && (
        <FormErrorMessage>{errorMsg ?? error?.message}</FormErrorMessage>
      )}
    </FormControl>
  );
}

export default PasswordField;

import { PasswordInput, PasswordInputProps } from "@mantine/core";
import { useFormContext } from "react-hook-form";
import get from "lodash/get";

type Props = PasswordInputProps & {
  name: string;
};

function PasswordField({ name, ...props }: Props) {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const error = get(errors, name);

  return (
    <PasswordInput error={error?.message} {...props} {...register(name)} />
  );
}

export default PasswordField;

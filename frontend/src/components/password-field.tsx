import { PasswordInput, PasswordInputProps } from "@mantine/core";
import { get, useFormContext } from "react-hook-form";

type Props = PasswordInputProps & {
  name: string;
};

function PasswordField({ name, required, ...props }: Props) {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const error = get(errors, name);

  return (
    <PasswordInput
      withAsterisk={required}
      {...props}
      error={error?.message}
      {...register(name)}
    />
  );
}

export default PasswordField;

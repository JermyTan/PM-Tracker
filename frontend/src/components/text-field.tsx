import { TextInput, TextInputProps } from "@mantine/core";
import { useFormContext, get } from "react-hook-form";

type Props = TextInputProps & {
  name: string;
};

function TextField({ name, required, ...props }: Props) {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const error = get(errors, name);

  return (
    <TextInput
      withAsterisk={required}
      {...props}
      error={error?.message}
      {...register(name)}
    />
  );
}

export default TextField;

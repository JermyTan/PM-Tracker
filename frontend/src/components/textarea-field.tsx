import { Textarea, TextareaProps } from "@mantine/core";
import { get, useFormContext } from "react-hook-form";

type Props = TextareaProps & {
  name: string;
};

function TextareaField({ name, required, ...props }: Props) {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const error = get(errors, name);

  return (
    <Textarea
      withAsterisk={required}
      {...props}
      error={error?.message}
      {...register(name)}
    />
  );
}

export default TextareaField;

import { Textarea, TextareaProps } from "@mantine/core";
import { get, useFormContext } from "react-hook-form";

type Props = TextareaProps & {
  name: string;
};

function TextareaField({ name, ...props }: Props) {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const error = get(errors, name);

  return (
    <Textarea
      error={error?.message}
      autosize
      minRows={3}
      maxRows={10}
      {...props}
      {...register(name)}
    />
  );
}

export default TextareaField;

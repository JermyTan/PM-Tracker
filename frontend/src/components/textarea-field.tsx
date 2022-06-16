import { Textarea, TextareaProps } from "@mantine/core";
import { useFormContext } from "react-hook-form";
import get from "lodash/get";

type Props = TextareaProps & {
  name: string;
};

function TextareaField({ name, ...props }: Props) {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const error = get(errors, name);

  return <Textarea error={error?.message} {...props} {...register(name)} />;
}

export default TextareaField;

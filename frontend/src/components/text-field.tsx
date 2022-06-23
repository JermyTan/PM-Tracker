import { TextInput, TextInputProps } from "@mantine/core";
import { useFormContext } from "react-hook-form";
import get from "lodash/get";

type Props = TextInputProps & {
  name: string;
};

function TextField({ name, ...props }: Props) {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const error = get(errors, name);

  return <TextInput error={error?.message} {...props} {...register(name)} />;
}

export default TextField;

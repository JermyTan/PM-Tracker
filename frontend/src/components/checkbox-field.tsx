import { Checkbox, CheckboxProps } from "@mantine/core";
import { get, useFormContext } from "react-hook-form";
import { useEffect } from "react";
import toastUtils from "../utils/toast-utils";

type Props = CheckboxProps & {
  name: string;
};

function CheckboxField({ name, ...props }: Props) {
  const {
    formState: { errors },
    register,
  } = useFormContext();

  const error = get(errors, name);

  useEffect(() => {
    if (error?.message) {
      toastUtils.error({ message: error.message });
    }
  }, [error]);

  return <Checkbox {...props} {...register(name)} />;
}

export default CheckboxField;

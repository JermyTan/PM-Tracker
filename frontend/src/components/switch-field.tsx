import { Switch, SwitchProps } from "@mantine/core";
import { useFormContext } from "react-hook-form";
import get from "lodash/get";
import { useEffect } from "react";
import toastUtils from "../utils/toast-utils";

type Props = SwitchProps & {
  name: string;
};

function SwitchField({ name, ...props }: Props) {
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

  return <Switch {...props} {...register(name)} />;
}

export default SwitchField;

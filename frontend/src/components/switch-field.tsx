import { Switch, SwitchProps } from "@mantine/core";
import { useController } from "react-hook-form";
import { useEffect } from "react";
import toastUtils from "../utils/toast-utils";

type Props = SwitchProps & {
  name: string;
};

function SwitchField({ name, ...props }: Props) {
  const {
    field: { value, ...other },
    fieldState: { error },
  } = useController<{ [name: string]: boolean }>({ name });

  useEffect(() => {
    if (error?.message) {
      toastUtils.error({ message: error.message });
    }
  }, [error]);

  return <Switch {...props} checked={value} {...other} />;
}

export default SwitchField;

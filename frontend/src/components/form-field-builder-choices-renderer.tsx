import { List, ListProps } from "@mantine/core";
import { useWatch } from "react-hook-form";
import { sanitizeArray } from "../utils/transform-utils";

type Props = {
  name: string;
} & Omit<ListProps, "children">;

function FormFieldBuilderChoicesRenderer({ name, ...props }: Props) {
  const choicesString = useWatch<{ [name: string]: unknown }>({ name });
  const choices =
    typeof choicesString === "string"
      ? sanitizeArray(choicesString.split("\n"), { unique: false })
      : [];

  return (
    <List {...props}>
      {choices.map((choice) => (
        <List.Item>{choice}</List.Item>
      ))}
    </List>
  );
}

export default FormFieldBuilderChoicesRenderer;

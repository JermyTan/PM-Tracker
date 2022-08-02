import { FormResponseField } from "../types/submissions";

type Props = {
  name: string;
  formResponseField: FormResponseField;
};

function FormFieldRenderer({ name, formResponseField }: Props) {
  return (
    <div>
      <div>{name}</div>
      <div>{JSON.stringify(formResponseField, null, 2)}</div>
    </div>
  );
}

export default FormFieldRenderer;

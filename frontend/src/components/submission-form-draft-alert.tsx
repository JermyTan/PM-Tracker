import { Alert } from "@mantine/core";
import { useWatch } from "react-hook-form";
import { ImInsertTemplate } from "react-icons/im";

type Props = {
  name: string;
};

function SubmissionFormDraftAlert({ name }: Props) {
  const isDraft = useWatch<{ [name: string]: boolean }>({ name });

  if (!isDraft) {
    return null;
  }

  return (
    <Alert
      p="xs"
      color="orange"
      icon={<ImInsertTemplate />}
      title="This is a draft submission"
    >
      Required fields are not enforced in a draft submission.
      <br />
      Once you have finalized your submission, please toggle off this draft
      state so that all the fields can be validated and this submission will be
      tagged as final.
    </Alert>
  );
}

export default SubmissionFormDraftAlert;

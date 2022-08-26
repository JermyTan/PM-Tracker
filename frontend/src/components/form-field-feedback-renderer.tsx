import { Button, TypographyStylesProvider, Text, Stack } from "@mantine/core";
import { useFormContext } from "react-hook-form";
import { FaRegSmile } from "react-icons/fa";
import { useLazyGetFeedbackQuery } from "../redux/services/feedback-api";
import { useResolveError } from "../utils/error-utils";

type Props = {
  name: string;
};

function FormFieldFeedbackRenderer({ name }: Props) {
  const { getValues } = useFormContext<{ [name: string]: string }>();
  const [getFeedback, { isFetching, feedbackResult }] = useLazyGetFeedbackQuery(
    {
      selectFromResult: ({ isFetching, data: feedbackResult }) => ({
        isFetching,
        feedbackResult,
      }),
    },
  );
  const { resolveError } = useResolveError({
    name: "form-field-feedback-renderer",
  });

  const onGenerateFeedback = () => {
    const content = getValues(name);
    if (isFetching || !content) {
      return;
    }

    getFeedback({ content })
      .unwrap()
      .catch((error) => resolveError(error));
  };

  return (
    <Stack>
      <div>
        <Button
          leftIcon={<FaRegSmile />}
          compact
          loading={isFetching}
          onClick={onGenerateFeedback}
        >
          {isFetching ? "Generating" : "Generate"} feedback
        </Button>
      </div>

      {feedbackResult && (
        <TypographyStylesProvider>
          <Text
            size="sm"
            dangerouslySetInnerHTML={{
              __html: feedbackResult.annotatedContent,
            }}
          />
          <Text
            size="sm"
            dangerouslySetInnerHTML={{
              __html: feedbackResult.feedback,
            }}
          />
        </TypographyStylesProvider>
      )}
    </Stack>
  );
}

export default FormFieldFeedbackRenderer;

import {
  Stack,
  Text,
  Loader,
  StackProps,
  LoaderProps,
  TextProps,
} from "@mantine/core";

type Props = StackProps & {
  isLoading?: boolean;
  loadingMessage?: string;
  showDefaultMessage?: boolean;
  defaultMessage?: string;
  isInverted?: boolean;
  loaderProps?: LoaderProps;
  textProps?: TextProps<"div">;
};

function PlaceholderWrapper({
  children,
  isLoading,
  loadingMessage,
  showDefaultMessage,
  defaultMessage,
  isInverted,
  loaderProps,
  textProps,
  ...props
}: Props) {
  return isLoading || showDefaultMessage ? (
    <Stack justify="center" align="center" spacing="sm" {...props}>
      {isLoading && (
        <>
          <Loader size="lg" variant="bars" {...loaderProps} />
          {loadingMessage && (
            <Text size="lg" {...textProps}>
              {loadingMessage}
            </Text>
          )}
        </>
      )}

      {!isLoading && showDefaultMessage && defaultMessage && (
        <Text size="lg" {...textProps}>
          {defaultMessage}
        </Text>
      )}
    </Stack>
  ) : (
    <>{children}</>
  );
}

export default PlaceholderWrapper;

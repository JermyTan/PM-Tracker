import {
  Spinner,
  Text,
  VStack,
  StackProps,
  SpinnerProps,
  TextProps,
} from "@chakra-ui/react";

type Props = StackProps & {
  isLoading?: boolean;
  loadingMessage?: string;
  showDefaultMessage?: boolean;
  defaultMessage?: string;
  isInverted?: boolean;
  spinnerProps?: SpinnerProps;
  textProps?: TextProps;
};

function PlaceholderWrapper({
  children,
  isLoading,
  loadingMessage,
  showDefaultMessage,
  defaultMessage,
  isInverted,
  spinnerProps,
  textProps,
  ...props
}: Props) {
  return isLoading || showDefaultMessage ? (
    <VStack justify="center" {...props}>
      {isLoading && (
        <>
          <Spinner speed="0.5s" size="xl" {...spinnerProps} />
          {loadingMessage && (
            <Text fontSize="xl" {...textProps}>
              {loadingMessage}
            </Text>
          )}
        </>
      )}

      {!isLoading && showDefaultMessage && defaultMessage && (
        <Text fontSize="xl" {...textProps}>
          {defaultMessage}
        </Text>
      )}
    </VStack>
  ) : (
    <>{children}</>
  );
}

export default PlaceholderWrapper;

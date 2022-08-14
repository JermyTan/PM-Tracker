import { createStyles } from "@mantine/core";

const useStyles = createStyles(
  (_, { referencePadding }: { referencePadding: number }) => ({
    scrollAreaContainer: {
      padding: `${referencePadding}px 0px ${referencePadding}px ${referencePadding}px !important`,
    },
  }),
);

export default function useGetScrollAreaContainerPaddingStyle({
  scrollbarSize,
  referencePadding,
}: {
  scrollbarSize: number;
  referencePadding: number;
}) {
  const adjustedPadding = referencePadding - scrollbarSize;
  const { classes } = useStyles({ referencePadding });

  return {
    scrollAreaContainerClassName: classes.scrollAreaContainer,
    adjustedPadding,
    referencePadding,
    scrollbarSize,
  };
}

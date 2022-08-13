import { createStyles } from "@mantine/core";

const useStyles = createStyles(
  (
    _,
    {
      adjustedPadding,
      referencePadding,
    }: { adjustedPadding: number; referencePadding: number },
  ) => ({
    scrollAreaContainer: {
      padding: `${referencePadding}px ${adjustedPadding}px ${referencePadding}px ${referencePadding}px !important`,
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
  const adjustedPadding = (referencePadding - scrollbarSize) / 2;
  const { classes } = useStyles({ adjustedPadding, referencePadding });

  return {
    scrollAreaContainerClassName: classes.scrollAreaContainer,
    adjustedPadding,
    referencePadding,
    scrollbarSize,
  };
}

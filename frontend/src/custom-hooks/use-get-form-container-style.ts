import { createStyles } from "@mantine/core";

export const MAX_FORM_WIDTH = "800px";

const useStyles = createStyles({
  formContainer: {
    maxWidth: MAX_FORM_WIDTH,
    width: "100%",
    alignSelf: "center",
  },
});

export default function useGetFormContainerStyle() {
  const { classes } = useStyles();

  return classes.formContainer;
}

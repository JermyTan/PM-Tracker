import { ColorScheme } from "@mantine/core";

export function colorModeValue<T>(
  colorScheme: ColorScheme,
  { lightModeValue, darkModeValue }: { lightModeValue?: T; darkModeValue?: T },
) {
  return colorScheme === "light" ? lightModeValue : darkModeValue;
}

import { Badge, useMantineTheme } from "@mantine/core";
import { colorModeValue } from "../utils/theme-utils";

type CourseStatusProps = { isPublished: boolean };

function CourseStatusBadge({ isPublished }: CourseStatusProps) {
  const { colorScheme } = useMantineTheme();

  return (
    <Badge
      variant={colorModeValue(colorScheme, {
        lightModeValue: "outline",
        darkModeValue: "light",
      })}
      color={isPublished ? "green" : "red"}
    >
      {isPublished ? "ACTIVE" : "INACTIVE"}
    </Badge>
  );
}

export default CourseStatusBadge;

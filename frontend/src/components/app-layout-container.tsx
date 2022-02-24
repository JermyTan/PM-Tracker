import { Box, BoxProps, Text } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

type Props = BoxProps;

function AppLayoutContainer(props: Props) {
  return (
    <Box {...props}>
      <Text>Hello</Text>
      <Outlet />
    </Box>
  );
}

export default AppLayoutContainer;

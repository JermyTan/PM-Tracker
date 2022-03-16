import {
  Box,
  BoxProps,
  useColorModeValue,
  Heading,
  Center,
  Text,
} from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import { MdSpaceDashboard } from "react-icons/md";
import { SiBookstack } from "react-icons/si";
import { DASHBOARD_PATH, MY_COURSES_PATH } from "../routes/paths";
import SidebarItem from "./sidebar-item";

type Props = Omit<BoxProps, "children"> & {
  isSidebarOpen: boolean;
};

function Sidebar({ isSidebarOpen, ...props }: Props) {
  const { pathname } = useLocation();

  return (
    <Box
      aria-label="Main navigation"
      as="nav"
      pos="fixed"
      top="0"
      left="0"
      h="full"
      overflowX="hidden"
      overflowY="auto"
      bgColor={useColorModeValue("white", "gray.800")}
      borderRightWidth="1px"
      whiteSpace="nowrap"
      {...props}
    >
      <Center p="4">
        <Heading size="lg">{isSidebarOpen ? "Pigeonhole" : "P"}</Heading>
      </Center>
      <SidebarItem
        icon={MdSpaceDashboard}
        to={DASHBOARD_PATH}
        isActive={pathname === DASHBOARD_PATH}
        showIconOnly={!isSidebarOpen}
      >
        <Text as="span">Dashboard</Text>
      </SidebarItem>
      <SidebarItem
        icon={SiBookstack}
        to={MY_COURSES_PATH}
        isActive={pathname === MY_COURSES_PATH}
        showIconOnly={!isSidebarOpen}
      >
        <Text as="span">My courses</Text>
      </SidebarItem>
    </Box>
  );
}

export default Sidebar;

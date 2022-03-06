import { ReactNode } from "react";
import { Box, Text, useDisclosure } from "@chakra-ui/react";
import Header from "./header";
import Sidebar from "./sidebar";

type Props = {
  children: ReactNode;
};

const EXPANDED_SIDEBAR_WIDTH = "60";
const COLLAPSED_SIDEBAR_WIDTH = "16";

function AppLayout({ children }: Props) {
  const sidebar = useDisclosure({ defaultIsOpen: true });
  const sidebarWidth = sidebar.isOpen
    ? EXPANDED_SIDEBAR_WIDTH
    : COLLAPSED_SIDEBAR_WIDTH;

  return (
    <Box minH="100vh">
      {/* Sidebar */}
      <Sidebar
        isSidebarOpen={sidebar.isOpen}
        w={sidebarWidth}
        transition=".3s ease"
      />

      {/* Main page */}
      <Box ml={sidebarWidth} transition=".3s ease">
        {/* Header */}
        <Header
          isSiderbarOpen={sidebar.isOpen}
          onSidebarToggle={sidebar.onToggle}
        />

        {/* Main content */}
        <Box as="main" p="4">
          {children}
        </Box>
        <Box height="3000px" />
      </Box>
    </Box>
  );
}

export default AppLayout;

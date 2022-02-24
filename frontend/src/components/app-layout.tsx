import {
  Box,
  useColorModeValue,
  Text,
  useDisclosure,
  Heading,
  Center,
  Avatar,
  Flex,
  HStack,
  Spacer,
  IconButton,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { HiMenu } from "react-icons/hi";
import { useDeepEqualAppSelector } from "../redux/hooks";
import { selectCurrentUserDisplayInfo } from "../redux/slices/current-user-slice";
import ColorModeToggler from "./color-mode-toggler";

type Props = {
  children: ReactNode;
};

const EXPANDED_SIDEBAR_WIDTH = "60";
const COLLAPSED_SIDEBAR_WIDTH = "16";

function AppLayout({ children }: Props) {
  const { name, profileImage } =
    useDeepEqualAppSelector(selectCurrentUserDisplayInfo) ?? {};
  const sidebar = useDisclosure({ defaultIsOpen: true });
  const sidebarWidth = sidebar.isOpen
    ? EXPANDED_SIDEBAR_WIDTH
    : COLLAPSED_SIDEBAR_WIDTH;

  return (
    <Box minH="100vh">
      {/* Sidebar */}
      <Box
        as="nav"
        pos="fixed"
        top="0"
        left="0"
        zIndex="sticky"
        h="full"
        overflowX="hidden"
        overflowY="auto"
        bgColor={useColorModeValue("white", "gray.800")}
        borderColor={useColorModeValue("inherit", "gray.700")}
        borderRightWidth="1px"
        w={sidebarWidth}
        transition=".3s ease"
      >
        <Center p="4">
          <Heading size="lg">Pigeonhole</Heading>
        </Center>
      </Box>

      {/* Main page */}
      <Box ml={sidebarWidth} transition=".3s ease">
        {/* Header */}
        <Flex
          as="header"
          align="center"
          maxW="full"
          h="14"
          px="4"
          borderBottomWidth="1px"
          bg={useColorModeValue("white", "gray.800")}
          borderColor={useColorModeValue("inherit", "gray.700")}
        >
          <IconButton
            aria-label={sidebar.isOpen ? "Collapse sidebar" : "Expand sidebar"}
            icon={<HiMenu />}
            variant="ghost"
            onClick={sidebar.onToggle}
          />
          <Spacer />
          <HStack>
            <Text as="span">{name}</Text>
            <Avatar size="sm" name={name} src={profileImage || undefined} />
            <ColorModeToggler variant="ghost" />
          </HStack>
        </Flex>

        {/* Main content */}
        <Box as="main" p="4">
          {children}
          <Text>
            assssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdadaassssssasdsadasdasdsadasdasdadadadadadasdada
          </Text>
        </Box>
        <Box height="3000px" />
      </Box>
    </Box>
  );
}

export default AppLayout;

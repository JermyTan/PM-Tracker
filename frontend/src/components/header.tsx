import {
  Flex,
  FlexProps,
  useColorModeValue,
  IconButton,
  Spacer,
  HStack,
  Text,
  Avatar,
} from "@chakra-ui/react";
import { HiMenu } from "react-icons/hi";
import ColorModeToggler from "./color-mode-toggler";
import { useDeepEqualAppSelector } from "../redux/hooks";
import { selectCurrentUserDisplayInfo } from "../redux/slices/current-user-slice";

type Props = Omit<FlexProps, "children"> & {
  isSiderbarOpen: boolean;
  onSidebarToggle: () => void;
};

function Header({ isSiderbarOpen, onSidebarToggle, ...props }: Props) {
  const { name, profileImage } =
    useDeepEqualAppSelector(selectCurrentUserDisplayInfo) ?? {};

  return (
    <Flex
      as="header"
      align="center"
      maxW="full"
      h="14"
      px="4"
      borderBottomWidth="1px"
      bg={useColorModeValue("white", "gray.800")}
      pos="sticky"
      zIndex="sticky"
      top="0"
      {...props}
    >
      <IconButton
        aria-label={isSiderbarOpen ? "Collapse sidebar" : "Expand sidebar"}
        icon={<HiMenu />}
        variant="ghost"
        onClick={onSidebarToggle}
      />
      <Spacer />
      <HStack>
        <Text as="span">{name}</Text>
        <Avatar size="sm" name={name} src={profileImage || undefined} />
        <ColorModeToggler variant="ghost" />
      </HStack>
    </Flex>
  );
}

export default Header;

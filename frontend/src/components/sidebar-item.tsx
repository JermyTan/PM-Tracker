import { ReactNode } from "react";
import { IconType } from "react-icons";
import {
  HStack,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  StackProps,
  useColorModeValue,
  Portal,
  PopoverArrow,
} from "@chakra-ui/react";
import { HiCollection } from "react-icons/hi";
import { Link, LinkProps } from "react-router-dom";

type Props = StackProps &
  LinkProps & {
    children: ReactNode;
    icon?: IconType;
    showIconOnly?: boolean;
    isActive?: boolean;
  };

function SidebarItem({
  icon = HiCollection,
  showIconOnly,
  children,
  isActive,
  ...props
}: Props) {
  const activeProps = {
    bg: useColorModeValue("gray.100", "gray.700"),
    color: useColorModeValue("gray.900", "gray.200"),
  };
  const inactiveProps = {
    color: useColorModeValue("gray.600", "gray.400"),
  };

  return (
    <Popover
      isOpen={showIconOnly ? undefined : false}
      trigger="hover"
      placement="right"
    >
      <PopoverTrigger>
        <HStack
          justify={showIconOnly ? "center" : undefined}
          px="6"
          py="3"
          cursor="pointer"
          fontWeight="semibold"
          transition=".15s ease"
          {...(isActive ? activeProps : inactiveProps)}
          _hover={activeProps}
          as={Link}
          {...props}
        >
          <Icon boxSize={showIconOnly ? "6" : "4"} as={icon} />
          {!showIconOnly && children}
        </HStack>
      </PopoverTrigger>
      <Portal>
        <PopoverContent
          shadow={useColorModeValue("md", "md-dark")}
          fontWeight="semibold"
          width="fit-content"
        >
          <PopoverArrow />
          <PopoverBody>{children}</PopoverBody>
        </PopoverContent>
      </Portal>
    </Popover>
  );
}

export default SidebarItem;

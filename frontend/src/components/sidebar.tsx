import {
  Box,
  BoxProps,
  Center,
  createStyles,
  ScrollArea,
  Title,
} from "@mantine/core";
import { useLocation, useNavigate } from "react-router-dom";
import { MdSpaceDashboard, MdLogout } from "react-icons/md";
import { SiBookstack } from "react-icons/si";
import { DASHBOARD_PATH, LOGIN_PATH, MY_COURSES_PATH } from "../routes/paths";
import SidebarItem from "./sidebar-item";
import SidebarLinkItem from "./sidebar-link-item";
import { useAppDispatch } from "../redux/hooks";
import resetAppState from "../redux/thunks/reset-app-state";
import toastUtils from "../utils/toast-utils";

type Props = Omit<BoxProps<"nav">, "children"> & {
  isSidebarExpanded: boolean;
};

const EXPANDED_SIDEBAR_WIDTH = "220px";
const COLLAPSED_SIDEBAR_WIDTH = "64px";

const useStyles = createStyles(
  (theme, { isSidebarExpanded }: { isSidebarExpanded: boolean }) => {
    const sidebarWidth = isSidebarExpanded
      ? EXPANDED_SIDEBAR_WIDTH
      : COLLAPSED_SIDEBAR_WIDTH;

    return {
      sidebar: {
        display: "flex",
        flexDirection: "column",
        transition: ".3s ease",
        width: sidebarWidth,
        overflow: "hidden",
      },
      navContainer: {
        flex: "1 1 auto",
      },
    };
  },
);

function Sidebar({ isSidebarExpanded, className, ...props }: Props) {
  const { pathname } = useLocation();
  const { classes, cx } = useStyles({ isSidebarExpanded });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Box<"nav">
      aria-label="Main navigation"
      component="nav"
      className={cx(classes.sidebar, className)}
      pb="xl"
      {...props}
    >
      <Center py="sm" px="md">
        <Title>{isSidebarExpanded ? "Pigeonhole" : "P"}</Title>
      </Center>

      <ScrollArea
        className={classes.navContainer}
        scrollbarSize={isSidebarExpanded ? 10 : 6}
        scrollHideDelay={500}
      >
        <SidebarLinkItem
          icon={MdSpaceDashboard}
          label="Dashboard"
          to={DASHBOARD_PATH}
          isActive={pathname === DASHBOARD_PATH}
          showIconOnly={!isSidebarExpanded}
        />
        <SidebarLinkItem
          icon={SiBookstack}
          label="My Courses"
          to={MY_COURSES_PATH}
          isActive={pathname === MY_COURSES_PATH}
          showIconOnly={!isSidebarExpanded}
        />
      </ScrollArea>

      <div>
        <SidebarItem
          icon={MdLogout}
          label="Sign Out"
          showIconOnly={!isSidebarExpanded}
          onClick={() => {
            dispatch(resetAppState());
            navigate(LOGIN_PATH);
            toastUtils.success({ message: "Signed out successfully." });
          }}
        />
      </div>
    </Box>
  );
}

export default Sidebar;

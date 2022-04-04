import { Link, LinkProps } from "react-router-dom";
import SidebarItem, { SidebarItemProps } from "./sidebar-item";

type Props = Omit<SidebarItemProps<typeof Link> & LinkProps, "children">;

function SidebarLinkItem(props: Props) {
  return <SidebarItem<typeof Link> component={Link} {...props} />;
}

export default SidebarLinkItem;

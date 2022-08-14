import { Link } from "react-router-dom";
import SidebarItem, { SidebarItemProps } from "./sidebar-item";

type Props = SidebarItemProps<typeof Link>;

function SidebarLinkItem(props: Props) {
  return <SidebarItem<typeof Link> component={Link} {...props} />;
}

export default SidebarLinkItem;

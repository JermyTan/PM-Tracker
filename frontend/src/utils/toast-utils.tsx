import { showNotification, NotificationProps } from "@mantine/notifications";
import { FaExclamation, FaCheck, FaInfo } from "react-icons/fa";

export function success(notifications: NotificationProps) {
  showNotification({
    color: "green",
    icon: <FaCheck />,
    ...notifications,
  });
}

export function info(notifications: NotificationProps) {
  showNotification({ color: "blue", icon: <FaInfo />, ...notifications });
}

export function warning(notifications: NotificationProps) {
  showNotification({
    color: "yellow",
    icon: <FaExclamation />,
    ...notifications,
  });
}

export function error(notifications: NotificationProps) {
  showNotification({
    color: "red",
    icon: <FaExclamation />,
    ...notifications,
  });
}

export default { success, info, warning, error };

import { showNotification, NotificationProps } from "@mantine/notifications";
import { FaExclamation, FaCheck, FaInfo } from "react-icons/fa";

function myShowNotification(notification: NotificationProps) {
  showNotification({
    styles: { root: { overflowY: "auto" } },
    ...notification,
  });
}

export function success(notifications: NotificationProps) {
  myShowNotification({
    color: "green",
    icon: <FaCheck />,
    ...notifications,
  });
}

export function info(notifications: NotificationProps) {
  myShowNotification({ color: "blue", icon: <FaInfo />, ...notifications });
}

export function warning(notifications: NotificationProps) {
  myShowNotification({
    color: "yellow",
    icon: <FaExclamation />,
    ...notifications,
  });
}

export function error(notifications: NotificationProps) {
  myShowNotification({
    color: "red",
    icon: <FaExclamation />,
    ...notifications,
  });
}

export default { success, info, warning, error };

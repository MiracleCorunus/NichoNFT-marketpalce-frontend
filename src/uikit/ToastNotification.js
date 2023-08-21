import { notification } from 'antd';

const ToastNotification = ({ title, description, icon, duration }) => {
  notification.open({
    message: title ?? 'New notification',
    description,
    icon,
    duration: duration ?? 3
  });
};

export default ToastNotification;
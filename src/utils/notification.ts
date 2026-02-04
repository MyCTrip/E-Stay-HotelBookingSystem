import { notification } from 'antd';

export default function notify(
  type: 'success' | 'error' | 'info' | 'warning',
  title: string,
  msg?: string
) {
  notification[type]({ message: title, description: msg });
}

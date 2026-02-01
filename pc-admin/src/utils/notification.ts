import { notification } from 'antd'

const notify = (type: 'success' | 'error' | 'info' | 'warning', title: string, msg?: string) => {
  notification[type]({ message: title, description: msg })
}

export default notify

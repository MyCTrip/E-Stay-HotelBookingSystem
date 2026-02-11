import { RouterProvider } from 'react-router-dom'
import router from './router'

/**
 * 根应用组件
 */
function App() {
  return <RouterProvider router={router} />
}

export default App

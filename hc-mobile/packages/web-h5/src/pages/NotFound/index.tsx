import { Link } from 'react-router-dom'
import styles from './index.module.css'

/**
 * 404 页面
 */
export default function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2>页面未找到</h2>
        <p>抱歉，您要查找的页面不存在</p>
        <Link to="/" className={styles.button}>
          返回首页
        </Link>
      </div>
    </div>
  )
}

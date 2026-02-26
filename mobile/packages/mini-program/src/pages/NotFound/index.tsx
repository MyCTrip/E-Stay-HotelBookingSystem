import { View, Text } from '@tarojs/components'
import MainLayout from '../../layouts/MainLayout'
import { navigate } from '../../router'
import styles from './index.module.scss'

/**
 * 404 页面
 * 业务逻辑与web-h5完全相同
 */
export default function NotFoundPage() {
  return (
    <MainLayout>
      <View className={styles.container}>
        <View className={styles.content}>
          <Text className={styles.code}>404</Text>
          <Text className={styles.title}>页面未找到</Text>
          <Text className={styles.message}>抱歉，您要查找的页面不存在</Text>
          <View className={styles.button} onClick={() => navigate.toHome()}>
            <Text>返回首页</Text>
          </View>
        </View>
      </View>
    </MainLayout>
  )
}

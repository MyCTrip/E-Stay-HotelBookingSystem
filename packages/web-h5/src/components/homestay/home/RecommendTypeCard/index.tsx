/**
 * 推荐类型卡片组件
 * 上文字（title + subtitle）下圆形图标
 */

import React from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './index.module.scss'

export interface RecommendTypeCardProps {
  id: string
  title: string
  subtitle: string
  icon: React.ReactNode // SVG icon 组件或 ReactNode
  backgroundGradient: string | { from: string; to: string } // 渐变色配置
  searchParams?: {
    city?: string
    tag?: string
    [key: string]: string | undefined
  }
  onClick?: () => void
}

const RecommendTypeCard: React.FC<RecommendTypeCardProps> = ({
  title,
  subtitle,
  icon,
  backgroundGradient,
  searchParams = {},
  onClick,
}) => {
  const navigate = useNavigate()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (searchParams && Object.keys(searchParams).length > 0) {
      // 构建查询参数并跳转到搜索结果页
      const queryParams = new URLSearchParams()
      Object.entries(searchParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value))
        }
      })
      navigate(`/search/homeStay?${queryParams.toString()}`)
    }
  }

  // 处理渐变色配置
  const getBackgroundStyle = () => {
    if (typeof backgroundGradient === 'string') {
      return { background: backgroundGradient }
    }
    return {
      background: `linear-gradient(135deg, ${backgroundGradient.from} 0%, ${backgroundGradient.to} 100%)`,
    }
  }

  return (
    <div
      className={styles.card}
      style={getBackgroundStyle()}
      onClick={handleClick}
    >
      {/* 文本区域 */}
      <div className={styles.textSection}>
        <h3 className={styles.title}>{title}</h3>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      {/* 圆形图标区域 */}
      <div className={styles.iconContainer}>
        {icon}
      </div>
    </div>
  )
}

export default React.memo(RecommendTypeCard)

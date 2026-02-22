/**
 * 民宿详情页专用Layout
 * 三层结构：固定Header + 固定Tabs导航 + 可滚动内容 + 固定Footer
 */

import React, { useRef, useState, useCallback, useEffect, ReactNode } from 'react'
import styles from './DetailLayout.module.scss'
import { BackIcon } from '../components/icons/BackIcon'
import { CollectionIcon } from '../components/icons/CollectionIcon'
import { ShareIcon } from '../components/icons/ShareIcon'

export type DetailTabKey =
  | 'overview'
  | 'rooms'
  | 'reviews'
  | 'facilities'
  | 'policies'
  | 'knowledge'
  | 'nearby'
  | 'host'

interface DetailLayoutProps {
  /** 主要内容区域 */
  children: ReactNode
  /** 导航Tabs组件 */
  tabs: ReactNode
  /** 底部预订栏组件 */
  footer: ReactNode
  /** 当前激活的Tab */
  activeTab: DetailTabKey
  /** Tab变更回调 */
  onTabChange: (tab: DetailTabKey) => void
  /** 页面数据 */
  data?: unknown
  /** 房东联系回调 */
  onContactHost?: () => void
  /** 返回按钮点击 */
  onBack?: () => void
  /** 分享按钮点击 */
  onShare?: () => void
  /** 收藏状态变更 */
  onCollectionChange?: () => void
}

/**
 * Section引用类型，用于滚动定位
 */
export interface SectionRefs {
  overview?: React.RefObject<HTMLDivElement>
  rooms?: React.RefObject<HTMLDivElement>
  reviews?: React.RefObject<HTMLDivElement>
  facilities?: React.RefObject<HTMLDivElement>
  policies?: React.RefObject<HTMLDivElement>
  knowledge?: React.RefObject<HTMLDivElement>
  nearby?: React.RefObject<HTMLDivElement>
  host?: React.RefObject<HTMLDivElement>
}

const DetailLayout = React.forwardRef<HTMLDivElement, DetailLayoutProps>(
  (
    { children, tabs, footer, activeTab, onTabChange, data, onBack, onShare, onCollectionChange },
    containerRef
  ) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const sentinelRefsRef = useRef<Record<string, HTMLDivElement | null>>({})
    const sentinelObserverRef = useRef<IntersectionObserver | null>(null)
    const [headerOpacity, setHeaderOpacity] = useState(0)
    const [isTabsFixed, setIsTabsFixed] = useState(false)
    const [isCollected, setIsCollected] = useState(false)

    /**
     * 注册哨兵元素 - 在滚动时检测其位置
     */
    const registerSentinel = useCallback(
      (key: DetailTabKey, sentinelEl: HTMLDivElement) => {
        sentinelRefsRef.current[key] = sentinelEl

        // 确保只创建一个 Observer 实例
        if (!sentinelObserverRef.current && scrollContainerRef.current) {
          sentinelObserverRef.current = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                // 找到对应的 tab key
                const tabKey = Object.entries(sentinelRefsRef.current).find(
                  ([, element]) => element === entry.target
                )?.[0] as DetailTabKey

                if (!tabKey) return

                // 当哨兵进入视口时更新 tab（使用40%位置检测）
                if (entry.isIntersecting) {
                  if (tabKey !== activeTab) {
                    onTabChange(tabKey)
                  }
                }
              })
            },
            {
              root: scrollContainerRef.current,
              // 关键：rootMargin 设置为负值表示元素距离顶部多少时触发
              // 这里 -44px 是 Header 高度，-60% 表示元素到达窗口的 40% 位置时触发
              rootMargin: '-44px 0px -60% 0px',
              threshold: 0,
            }
          )
        }

        // 观察该哨兵
        if (sentinelObserverRef.current) {
          sentinelObserverRef.current.observe(sentinelEl)
        }
      },
      [activeTab, onTabChange]
    )

    /**
     * 清理 Intersection Observer
     */
    useEffect(() => {
      return () => {
        if (sentinelObserverRef.current) {
          sentinelObserverRef.current.disconnect()
        }
      }
    }, [])

    /**
     * 处理返回按钮
     */
    const handleBack = () => {
      if (onBack) {
        onBack()
      } else {
        window.history.back()
      }
    }

    /**
     * 处理收藏按钮
     */
    const handleCollect = () => {
      setIsCollected(!isCollected)
      onCollectionChange?.()
    }

    /**
     * 处理分享按钮
     */
    const handleShareClick = () => {
      onShare?.()
    }

    /**
     * 处理容器滚动事件 - 在滚动时检测哨兵位置并更新tab
     */
    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget
        const scrollTop = target.scrollTop
        const containerHeight = target.clientHeight

        // 计算Header透明度（图片高度约300px）
        const imageHeight = 300
        const opacity = Math.min(scrollTop / imageHeight, 1)
        setHeaderOpacity(opacity)

        // Tabs吸顶判断（Header高44px）
        setIsTabsFixed(scrollTop > 0)

        // 检测哨兵位置 - 找到最接近40%位置的哨兵
        const tabKeys: DetailTabKey[] = [
          'overview',
          'rooms',
          'reviews',
          'facilities',
          'policies',
          'knowledge',
          'nearby',
          'host',
        ]
        const sentinelSnapshots: Array<{ key: DetailTabKey; offset: number }> = []

        tabKeys.forEach((key) => {
          const sentinel = sentinelRefsRef.current[key]
          if (sentinel) {
            const sentinelTop = sentinel.offsetTop
            sentinelSnapshots.push({
              key,
              offset: sentinelTop,
            })
          }
        })

        // 计算目标位置（窗口40%处）
        const targetPosition = scrollTop + containerHeight * 0.4

        // 找到最接近目标位置的哨兵
        let closestKey = activeTab
        let closestDistance = Infinity

        sentinelSnapshots.forEach(({ key, offset }) => {
          const distance = Math.abs(offset - targetPosition)
          if (distance < closestDistance) {
            closestDistance = distance
            closestKey = key
          }
        })

        // 如果找到了新的 tab，则更新
        if (closestKey !== activeTab) {
          onTabChange(closestKey)
        }
      },
      [activeTab, onTabChange]
    )

    /**
     * 平滑滚动到指定Tab对应的section
     */
    const scrollToSection = useCallback((tabKey: DetailTabKey) => {
      const sentinel = sentinelRefsRef.current[tabKey]
      if (sentinel && scrollContainerRef.current) {
        // 滚动到哨兵位置（减去Header高度）
        const offset = sentinel.offsetTop - 44
        scrollContainerRef.current.scrollTo({
          top: Math.max(0, offset),
          behavior: 'smooth',
        })
      }
    }, [])

    /**
     * 处理Tab点击 - 外层需要同时调用onTabChange和scrollToSection
     */
    const handleTabClick = useCallback(
      (tabKey: DetailTabKey) => {
        onTabChange(tabKey)
        scrollToSection(tabKey)
      },
      [onTabChange, scrollToSection]
    )

    // 将工具函数注入context或通过provider
    const contextValue = {
      registerSentinel,
      scrollToSection,
      handleTabClick,
    }

    return (
      <div className={styles.detailLayout} ref={containerRef}>
        {/* 固定顶部Header - 高度44px */}
        <div
          className={styles.headerWrapper}
          style={{
            backgroundColor: headerOpacity === 0 ? 'transparent' : `rgba(255, 255, 255, 1)`,
            borderBottomColor: headerOpacity === 0 ? 'transparent' : `rgba(240, 240, 240, 1)`,
          }}
        >
          {/* 左侧返回按钮 */}
          <button className={styles.headerBtn} onClick={handleBack} title="返回">
            <BackIcon size={24} color="#333" />
          </button>

          {/* 右侧操作按钮组 */}
          <div className={styles.headerActions}>
            {/* 收藏按钮 - 左 */}
            <button
              className={`${styles.headerBtn} ${isCollected ? styles.collected : ''}`}
              onClick={handleCollect}
              title={isCollected ? '已收藏' : '收藏'}
            >
              <CollectionIcon collected={isCollected} size={20} />
            </button>

            {/* 分享按钮 - 右 */}
            <button className={styles.headerBtn} onClick={handleShareClick} title="分享">
              <ShareIcon size={20} color="#333" />
            </button>
          </div>
        </div>

        {/* 固定导航Tabs - 高度44px, Header下方 */}
        <div
          className={`${styles.tabsWrapper} ${isTabsFixed ? styles.fixed : ''}`}
          style={{
            visibility: headerOpacity === 0 ? 'hidden' : 'visible',
            opacity: headerOpacity === 0 ? 0 : 1,
            transition: 'opacity 0.3s ease',
            height: headerOpacity === 0 ? '0px' : '44px',
          }}
        >
          {React.cloneElement(tabs as React.ReactElement, {
            activeTab,
            onChange: handleTabClick,
          })}
        </div>

        {/* 可滚动主体内容区 */}
        <div className={styles.contentWrapper} ref={scrollContainerRef} onScroll={handleScroll}>
          <div className={styles.contentInner}>
            {/* 注入registerSentinel到子组件 */}
            {React.cloneElement(children as React.ReactElement, {
              registerSentinel,
              contextValue,
            })}
          </div>
        </div>

        {/* 固定底部预订栏 - 高度56px */}
        <div className={styles.footerWrapper}>
          {React.cloneElement(footer as React.ReactElement, {
            data,
          })}
        </div>
      </div>
    )
  }
)

DetailLayout.displayName = 'DetailLayout'

export default DetailLayout

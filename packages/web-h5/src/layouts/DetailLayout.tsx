/**
 * 民宿详情页专用Layout
 * 三层结构：固定Header + 固定Tabs导航 + 可滚动内容 + 固定Footer
 */

import React, { useRef, useState, useCallback, useEffect, ReactNode } from 'react'
import styles from './DetailLayout.module.scss'
import { BackIcon } from '../components/icons/BackIcon'
import { CollectionIcon } from '../components/icons/CollectionIcon'
import { ShareIcon } from '../components/icons/ShareIcon'

export type DetailTabKey = 'overview' | 'rooms' | 'reviews' | 'facilities' | 'policies' | 'knowledge' | 'nearby' | 'host'

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
  data?: any
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
  ({ children, tabs, footer, activeTab, onTabChange, data, onContactHost, onBack, onShare, onCollectionChange }, containerRef) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null)
    const sectionRefsRef = useRef<SectionRefs>({})
    const observerRef = useRef<IntersectionObserver | null>(null)
    const [headerOpacity, setHeaderOpacity] = useState(0)
    const [isTabsFixed, setIsTabsFixed] = useState(false)
    const [isCollected, setIsCollected] = useState(false)

    /**
     * 注册section ref - 供子组件调用
     */
    const registerSectionRef = useCallback((key: DetailTabKey, ref: React.RefObject<HTMLDivElement>) => {
      sectionRefsRef.current[key] = ref

      // 设置Intersection Observer以追踪section可见性
      if (ref.current && scrollContainerRef.current) {
        if (!observerRef.current) {
          observerRef.current = new IntersectionObserver(
            (entries) => {
              // 找到第一个进入视口的section
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  const sectionKey = Object.entries(sectionRefsRef.current).find(
                    ([, refObj]) => refObj?.current === entry.target
                  )?.[0]

                  if (sectionKey && sectionKey !== activeTab) {
                    onTabChange(sectionKey as DetailTabKey)
                  }
                }
              })
            },
            {
              root: scrollContainerRef.current,
              rootMargin: '-44px 0px -50% 0px', // 仅跳过Header(44px)，Tabs浮动显示
              threshold: 0.1,
            }
          )
        }

        observerRef.current.observe(ref.current)
      }
    }, [activeTab, onTabChange])

    /**
     * 清理Intersection Observer
     */
    useEffect(() => {
      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect()
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
     * 处理容器滚动事件
     */
    const handleScroll = useCallback(
      (e: React.UIEvent<HTMLDivElement>) => {
        const target = e.currentTarget
        const scrollTop = target.scrollTop

        // 1. 计算Header透明度（图片高度约300px）
        const imageHeight = 300
        const opacity = Math.min(scrollTop / imageHeight, 1)
        setHeaderOpacity(opacity)

        // 2. Tabs吸顶判断（Header高44px）
        setIsTabsFixed(scrollTop > 0)
      },
      []
    )

    /**
     * 平滑滚动到指定Tab对应的section
     */
    const scrollToSection = useCallback((tabKey: DetailTabKey) => {
      const ref = sectionRefsRef.current[tabKey]
      if (ref?.current && scrollContainerRef.current) {
        // 减去Header高度(44px)，Tabs浮动显示不占位
        const offset = ref.current.offsetTop - 44
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
      registerSectionRef,
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
          <button 
            className={styles.headerBtn}
            onClick={handleBack}
            title="返回"
          >
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
            <button
              className={styles.headerBtn}
              onClick={handleShareClick}
              title="分享"
            >
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
        <div 
          className={styles.contentWrapper}
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          <div className={styles.contentInner}>
            {/* 注入registerSectionRef到子组件 */}
            {React.cloneElement(children as React.ReactElement, {
              registerSectionRef,
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

// 导出registerSectionRef供子组件使用
export const createSectionRef = () => useRef<HTMLDivElement>(null)

/**
 * 滑出容器组件 - 增强版，支持多方向、多位置和多种关闭模式
 * 向上/下/左/右滑出，支持屏幕边缘和元素边缘两种位置模式
 * 同一页面内自动互斥
 */

import React, { ReactNode, useRef, useEffect, useState, useMemo } from 'react'
import { createPortal } from 'react-dom'
import styles from './index.module.scss'
import { useSlideDrawerContext } from './context'
export { SlideDrawerProvider } from './context'

type Direction = 'up' | 'down' | 'left' | 'right'
type Edge = 'top' | 'bottom' | 'left' | 'right'
type Source = 'screen' | 'element'
type CloseMode = 'backButton' | 'clickOutside' | 'none'

// 向后兼容的旧类型
type LegacyDirection = 'up' | 'down' | 'left' | 'right' | 'bottom' | 'top'

interface SlideDrawerProps {
  visible: boolean
  children: ReactNode

  // 基础配置
  title?: string
  maxHeight?: string | number
  onClose: () => void

  // 方向和位置配置
  direction?: LegacyDirection // 划出方向: 向上、下、左、右
  source?: Source // 位置源: 屏幕边缘或元素边缘
  screenEdge?: Edge // 屏幕边缘: top/bottom/left/right (source='screen'时使用)
  elementRef?: React.RefObject<HTMLElement> // 参考元素 (source='element'时使用)
  elementEdge?: Edge // 元素边缘: top/bottom/left/right (source='element'时使用)
  // 向后兼容的旧prop
  position?: 'top' | 'center' | 'bottom' // 旧的位置prop，仅在direction为down时使用

  // 关闭模式配置
  closeModes?: CloseMode | CloseMode[] // 关闭方式集合
  showBackButton?: boolean // 是否显示返回按钮
  showHeader?: boolean // 是否显示头部

  // 其他配置
  overlay?: boolean // 是否显示遮罩层
  toggleRef?: React.RefObject<HTMLElement> // 可选的触发元素ref，用于自动切换drawer的显示/隐藏
  onToggle?: (isOpen: boolean) => void // 切换时的回调
}

const SlideDrawer: React.FC<SlideDrawerProps> = ({
  visible,
  children,
  title,
  maxHeight = '70vh',
  onClose,
  direction = 'up',
  source = 'screen',
  screenEdge: propsScreenEdge,
  elementRef,
  elementEdge = 'top',
  position, // 向后兼容
  closeModes = ['backButton', 'clickOutside'],
  showBackButton = true,
  showHeader = true,
  overlay = true,
  toggleRef,
  onToggle,
}) => {
  const drawerRef = useRef<HTMLDivElement>(null)
  const [elementPosition, setElementPosition] = useState<{
    top: number
    left: number
    width: number
    height: number
  } | null>(null)
  const onCloseRef = useRef(onClose)
  const visibleRef = useRef(visible)

  // 生成唯一的 drawer ID
  const drawerId = useMemo(() => Math.random().toString(36).substring(7), [])

  // 获取 SlideDrawer 上下文
  const drawerContext = useSlideDrawerContext()

  // 保持 onClose 回调最新
  useEffect(() => {
    onCloseRef.current = onClose
  }, [onClose])

  // 保持 visible 状态最新
  useEffect(() => {
    visibleRef.current = visible
  }, [visible])

  // 处理向后兼容逻辑
  const normalizeDirection = (): Direction => {
    if (direction === 'bottom') return 'up'
    if (direction === 'top') return 'down'
    return direction as Direction
  }

  const normalizeScreenEdge = (): Edge => {
    // 如果提供了新的 screenEdge，使用它
    if (propsScreenEdge) return propsScreenEdge

    // 否则，根据旧的 position 和 direction 推断
    if (position === 'top' && (direction === 'down' || direction === 'top')) return 'top'
    if (direction === 'bottom') return 'bottom'

    return 'bottom' // 默认
  }

  // 规范化元素边缘：当 source='element' 且 position 存在时，使用 position 映射
  const normalizeElementEdge = (): Edge => {
    if (source === 'element' && position) {
      return position as Edge
    }
    return elementEdge
  }

  const normalizedDirection = normalizeDirection()
  const normalizedScreenEdge = normalizeScreenEdge()
  const normalizedElementEdge = normalizeElementEdge()

  // 规范化 closeModes
  const closeModesArray = Array.isArray(closeModes) ? closeModes : [closeModes]
  const canCloseByBackButton = closeModesArray.includes('backButton') && showBackButton
  const canCloseByClickOutside = closeModesArray.includes('clickOutside')

  // 计算抽屉的样式（位置和大小）
  const getDrawerStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      position: 'fixed',
      zIndex: 1000,
      maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
    }

    // 根据源和方向计算位置
    if (source === 'element' && elementRef?.current && elementPosition) {
      const pos = elementPosition

      switch (normalizedElementEdge) {
        case 'top':
          baseStyle.top = pos.top
          baseStyle.left = pos.left
          baseStyle.width = pos.width
          break
        case 'bottom':
          baseStyle.top = pos.top + pos.height
          baseStyle.left = pos.left
          baseStyle.width = pos.width
          break
        case 'left':
          baseStyle.left = pos.left
          baseStyle.top = pos.top
          baseStyle.height = pos.height
          break
        case 'right':
          baseStyle.left = pos.left + pos.width
          baseStyle.top = pos.top
          baseStyle.height = pos.height
          break
      }
    } else {
      // 屏幕边缘位置
      switch (normalizedScreenEdge) {
        case 'top':
          baseStyle.top = 0
          baseStyle.left = 0
          baseStyle.right = 0
          break
        case 'bottom':
          baseStyle.bottom = 0
          baseStyle.left = 0
          baseStyle.right = 0
          break
        case 'left':
          baseStyle.left = 0
          baseStyle.top = 0
          baseStyle.bottom = 0
          break
        case 'right':
          baseStyle.right = 0
          baseStyle.top = 0
          baseStyle.bottom = 0
          break
      }
    }

    return baseStyle
  }

  // 获取抽屉的 CSS 类名
  const getDrawerClassName = (): string => {
    const classes = [styles.drawer]
    classes.push(styles[`direction-${normalizedDirection}`])
    if (visible) classes.push(styles.active)
    return classes.join(' ')
  }

  // 监听元素位置变化
  useEffect(() => {
    if (source !== 'element' || !elementRef?.current) return

    const updatePosition = () => {
      const rect = elementRef.current?.getBoundingClientRect()
      if (rect) {
        setElementPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        })
      }
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition)
    }
  }, [source, elementRef])

  // 处理 toggleRef 的点击事件 - 实现点击同一按钮切换 drawer 的功能
  useEffect(() => {
    if (!toggleRef?.current) return

    const handleToggleClick = (e: MouseEvent) => {
      e.stopPropagation()
      if (visibleRef.current) {
        // 已打开，则关闭
        onCloseRef.current()
      } else {
        // 未打开，则通知父组件打开
        onToggle?.(true)
      }
    }

    toggleRef.current.addEventListener('click', handleToggleClick)
    return () => {
      toggleRef.current?.removeEventListener('click', handleToggleClick)
    }
  }, [toggleRef, onToggle])

  // 注册/注销 drawer 到上下文，并处理互斥逻辑
  useEffect(() => {
    if (!drawerContext) return

    // 注册当前 drawer，使用 ref 中的最新 onClose
    drawerContext.registerDrawer({
      id: drawerId,
      onClose: () => onCloseRef.current(),
    })

    return () => {
      // 模组卸载时注销
      drawerContext.unregisterDrawer(drawerId)
    }
  }, [drawerContext, drawerId])

  // 当 drawer 打开时，关闭其他所有 drawer
  useEffect(() => {
    if (!visible || !drawerContext) return

    drawerContext.openDrawer(drawerId)
  }, [visible, drawerContext, drawerId])

  // 处理返回按钮点击
  const handleBackButtonClick = () => {
    if (canCloseByBackButton) {
      onCloseRef.current()
    }
  }

  // 处理遮罩层点击
  const handleOverlayClick = () => {
    if (canCloseByClickOutside) {
      onCloseRef.current()
    }
  }

  return createPortal(
    <>
      {/* 遮罩层 */}
      {overlay && (
        <div
          className={`${styles.overlay} ${visible ? styles.active : ''}`}
          onClick={handleOverlayClick}
        ></div>
      )}

      {/* 抽屉 */}
      <div ref={drawerRef} className={getDrawerClassName()} style={getDrawerStyle()}>
        {/* 头部 */}
        {showHeader && (
          <div className={styles.header}>
            {showBackButton && (
              <button className={styles.backBtn} onClick={handleBackButtonClick} aria-label="返回">
                <button className={styles.closeBtn} onClick={onClose}>
                  ✕
                </button>
              </button>
            )}
            <h2 className={styles.title}>{title || ''}</h2>
            <div className={styles.placeholder}></div>
          </div>
        )}

        {/* 内容区 */}
        <div className={styles.content}>{children}</div>
      </div>
    </>,
    document.body
  )
}

export default SlideDrawer

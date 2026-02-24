import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 民宿详情页专用Layout
 * 三层结构：固定Header + 固定Tabs导航 + 可滚动内容 + 固定Footer
 */
import React, { useRef, useState, useCallback, useEffect } from 'react';
import styles from './DetailLayout.module.scss';
import { BackIcon } from '../components/icons/BackIcon';
import { CollectionIcon } from '../components/icons/CollectionIcon';
import { ShareIcon } from '../components/icons/ShareIcon';
const DetailLayout = React.forwardRef(({ children, tabs, footer, activeTab, onTabChange, data, onBack, onShare, onCollectionChange }, containerRef) => {
    const scrollContainerRef = useRef(null);
    const sentinelRefsRef = useRef({});
    const sentinelObserverRef = useRef(null);
    const [headerOpacity, setHeaderOpacity] = useState(0);
    const [isTabsFixed, setIsTabsFixed] = useState(false);
    const [isCollected, setIsCollected] = useState(false);
    /**
     * 注册哨兵元素 - 在滚动时检测其位置
     */
    const registerSentinel = useCallback((key, sentinelEl) => {
        sentinelRefsRef.current[key] = sentinelEl;
        // 确保只创建一个 Observer 实例
        if (!sentinelObserverRef.current && scrollContainerRef.current) {
            sentinelObserverRef.current = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    // 找到对应的 tab key
                    const tabKey = Object.entries(sentinelRefsRef.current).find(([, element]) => element === entry.target)?.[0];
                    if (!tabKey)
                        return;
                    // 当哨兵进入视口时更新 tab（使用40%位置检测）
                    if (entry.isIntersecting) {
                        if (tabKey !== activeTab) {
                            onTabChange(tabKey);
                        }
                    }
                });
            }, {
                root: scrollContainerRef.current,
                // 关键：rootMargin 设置为负值表示元素距离顶部多少时触发
                // 这里 -44px 是 Header 高度，-60% 表示元素到达窗口的 40% 位置时触发
                rootMargin: '-44px 0px -60% 0px',
                threshold: 0,
            });
        }
        // 观察该哨兵
        if (sentinelObserverRef.current) {
            sentinelObserverRef.current.observe(sentinelEl);
        }
    }, [activeTab, onTabChange]);
    /**
     * 清理 Intersection Observer
     */
    useEffect(() => {
        return () => {
            if (sentinelObserverRef.current) {
                sentinelObserverRef.current.disconnect();
            }
        };
    }, []);
    /**
     * 处理返回按钮
     */
    const handleBack = () => {
        if (onBack) {
            onBack();
        }
        else {
            window.history.back();
        }
    };
    /**
     * 处理收藏按钮
     */
    const handleCollect = () => {
        setIsCollected(!isCollected);
        onCollectionChange?.();
    };
    /**
     * 处理分享按钮
     */
    const handleShareClick = () => {
        onShare?.();
    };
    /**
     * 处理容器滚动事件 - 在滚动时检测哨兵位置并更新tab
     */
    const handleScroll = useCallback((e) => {
        const target = e.currentTarget;
        const scrollTop = target.scrollTop;
        const containerHeight = target.clientHeight;
        // 计算Header透明度（图片高度约300px）
        const imageHeight = 300;
        const opacity = Math.min(scrollTop / imageHeight, 1);
        setHeaderOpacity(opacity);
        // Tabs吸顶判断（Header高44px）
        setIsTabsFixed(scrollTop > 0);
        // 检测哨兵位置 - 找到最接近40%位置的哨兵
        const tabKeys = [
            'overview',
            'rooms',
            'reviews',
            'facilities',
            'policies',
            'knowledge',
            'nearby',
            'host',
        ];
        const sentinelSnapshots = [];
        tabKeys.forEach((key) => {
            const sentinel = sentinelRefsRef.current[key];
            if (sentinel) {
                const sentinelTop = sentinel.offsetTop;
                sentinelSnapshots.push({
                    key,
                    offset: sentinelTop,
                });
            }
        });
        // 计算目标位置（窗口40%处）
        const targetPosition = scrollTop + containerHeight * 0.4;
        // 找到最接近目标位置的哨兵
        let closestKey = activeTab;
        let closestDistance = Infinity;
        sentinelSnapshots.forEach(({ key, offset }) => {
            const distance = Math.abs(offset - targetPosition);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestKey = key;
            }
        });
        // 如果找到了新的 tab，则更新
        if (closestKey !== activeTab) {
            onTabChange(closestKey);
        }
    }, [activeTab, onTabChange]);
    /**
     * 平滑滚动到指定Tab对应的section
     */
    const scrollToSection = useCallback((tabKey) => {
        const sentinel = sentinelRefsRef.current[tabKey];
        if (sentinel && scrollContainerRef.current) {
            // 滚动到哨兵位置（减去Header高度）
            const offset = sentinel.offsetTop - 44;
            scrollContainerRef.current.scrollTo({
                top: Math.max(0, offset),
                behavior: 'smooth',
            });
        }
    }, []);
    /**
     * 处理Tab点击 - 外层需要同时调用onTabChange和scrollToSection
     */
    const handleTabClick = useCallback((tabKey) => {
        onTabChange(tabKey);
        scrollToSection(tabKey);
    }, [onTabChange, scrollToSection]);
    // 将工具函数注入context或通过provider
    const contextValue = {
        registerSentinel,
        scrollToSection,
        handleTabClick,
    };
    return (_jsxs("div", { className: styles.detailLayout, ref: containerRef, children: [_jsxs("div", { className: styles.headerWrapper, style: {
                    backgroundColor: headerOpacity === 0 ? 'transparent' : `rgba(255, 255, 255, 1)`,
                    borderBottomColor: headerOpacity === 0 ? 'transparent' : `rgba(240, 240, 240, 1)`,
                }, children: [_jsx("button", { className: styles.headerBtn, onClick: handleBack, title: "\u8FD4\u56DE", children: _jsx(BackIcon, { size: 24, color: "#333" }) }), _jsxs("div", { className: styles.headerActions, children: [_jsx("button", { className: `${styles.headerBtn} ${isCollected ? styles.collected : ''}`, onClick: handleCollect, title: isCollected ? '已收藏' : '收藏', children: _jsx(CollectionIcon, { collected: isCollected, size: 20 }) }), _jsx("button", { className: styles.headerBtn, onClick: handleShareClick, title: "\u5206\u4EAB", children: _jsx(ShareIcon, { size: 20, color: "#333" }) })] })] }), _jsx("div", { className: `${styles.tabsWrapper} ${isTabsFixed ? styles.fixed : ''}`, style: {
                    visibility: headerOpacity === 0 ? 'hidden' : 'visible',
                    opacity: headerOpacity === 0 ? 0 : 1,
                    transition: 'opacity 0.3s ease',
                    height: headerOpacity === 0 ? '0px' : '44px',
                }, children: React.cloneElement(tabs, {
                    activeTab,
                    onChange: handleTabClick,
                }) }), _jsx("div", { className: styles.contentWrapper, ref: scrollContainerRef, onScroll: handleScroll, children: _jsx("div", { className: styles.contentInner, children: React.cloneElement(children, {
                        registerSentinel,
                        contextValue,
                    }) }) }), _jsx("div", { className: styles.footerWrapper, children: React.cloneElement(footer, {
                    data,
                }) })] }));
});
DetailLayout.displayName = 'DetailLayout';
export default DetailLayout;
//# sourceMappingURL=DetailLayout.js.map
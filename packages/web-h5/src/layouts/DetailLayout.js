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
const DetailLayout = React.forwardRef(({ children, tabs, footer, activeTab, onTabChange, data, onContactHost, onBack, onShare, onCollectionChange }, containerRef) => {
    const scrollContainerRef = useRef(null);
    const sectionRefsRef = useRef({});
    const observerRef = useRef(null);
    const [headerOpacity, setHeaderOpacity] = useState(0);
    const [isTabsFixed, setIsTabsFixed] = useState(false);
    const [isCollected, setIsCollected] = useState(false);
    /**
     * 注册section ref - 供子组件调用
     */
    const registerSectionRef = useCallback((key, ref) => {
        sectionRefsRef.current[key] = ref;
        // 设置Intersection Observer以追踪section可见性
        if (ref.current && scrollContainerRef.current) {
            if (!observerRef.current) {
                observerRef.current = new IntersectionObserver((entries) => {
                    // 找到第一个进入视口的section
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const sectionKey = Object.entries(sectionRefsRef.current).find(([, refObj]) => refObj?.current === entry.target)?.[0];
                            if (sectionKey && sectionKey !== activeTab) {
                                onTabChange(sectionKey);
                            }
                        }
                    });
                }, {
                    root: scrollContainerRef.current,
                    rootMargin: '-44px 0px -50% 0px', // 仅跳过Header(44px)，Tabs浮动显示
                    threshold: 0.1,
                });
            }
            observerRef.current.observe(ref.current);
        }
    }, [activeTab, onTabChange]);
    /**
     * 清理Intersection Observer
     */
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
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
     * 处理容器滚动事件
     */
    const handleScroll = useCallback((e) => {
        const target = e.currentTarget;
        const scrollTop = target.scrollTop;
        // 1. 计算Header透明度（图片高度约300px）
        const imageHeight = 300;
        const opacity = Math.min(scrollTop / imageHeight, 1);
        setHeaderOpacity(opacity);
        // 2. Tabs吸顶判断（Header高44px）
        setIsTabsFixed(scrollTop > 0);
    }, []);
    /**
     * 平滑滚动到指定Tab对应的section
     */
    const scrollToSection = useCallback((tabKey) => {
        const ref = sectionRefsRef.current[tabKey];
        if (ref?.current && scrollContainerRef.current) {
            // 减去Header高度(44px)，Tabs浮动显示不占位
            const offset = ref.current.offsetTop - 44;
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
        registerSectionRef,
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
                        registerSectionRef,
                        contextValue,
                    }) }) }), _jsx("div", { className: styles.footerWrapper, children: React.cloneElement(footer, {
                    data,
                }) })] }));
});
DetailLayout.displayName = 'DetailLayout';
export default DetailLayout;
// 导出registerSectionRef供子组件使用
export const createSectionRef = () => useRef(null);
//# sourceMappingURL=DetailLayout.js.map
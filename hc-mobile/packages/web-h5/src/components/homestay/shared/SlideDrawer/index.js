import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 滑出容器组件 - 增强版，支持多方向、多位置和多种关闭模式
 * 向上/下/左/右滑出，支持屏幕边缘和元素边缘两种位置模式
 * 同一页面内自动互斥
 */
import { useRef, useEffect, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import styles from './index.module.scss';
import { useSlideDrawerContext } from './context';
export { SlideDrawerProvider } from './context';
const SlideDrawer = ({ visible, children, title, maxHeight = '70vh', onClose, direction = 'up', source = 'screen', screenEdge: propsScreenEdge, elementRef, elementEdge = 'top', position, // 向后兼容
closeModes = ['backButton', 'clickOutside'], showBackButton = true, showHeader = true, overlay = true, toggleRef, onToggle, }) => {
    const drawerRef = useRef(null);
    const [elementPosition, setElementPosition] = useState(null);
    const onCloseRef = useRef(onClose);
    const visibleRef = useRef(visible);
    // 生成唯一的 drawer ID
    const drawerId = useMemo(() => Math.random().toString(36).substring(7), []);
    // 获取 SlideDrawer 上下文
    const drawerContext = useSlideDrawerContext();
    // 保持 onClose 回调最新
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);
    // 保持 visible 状态最新
    useEffect(() => {
        visibleRef.current = visible;
    }, [visible]);
    // 处理向后兼容逻辑
    const normalizeDirection = () => {
        if (direction === 'bottom')
            return 'up';
        if (direction === 'top')
            return 'down';
        return direction;
    };
    const normalizeScreenEdge = () => {
        // 如果提供了新的 screenEdge，使用它
        if (propsScreenEdge)
            return propsScreenEdge;
        // 否则，根据旧的 position 和 direction 推断
        if (position === 'top' && (direction === 'down' || direction === 'top'))
            return 'top';
        if (direction === 'bottom')
            return 'bottom';
        return 'bottom'; // 默认
    };
    // 规范化元素边缘：当 source='element' 且 position 存在时，使用 position 映射
    const normalizeElementEdge = () => {
        if (source === 'element' && position) {
            return position;
        }
        return elementEdge;
    };
    const normalizedDirection = normalizeDirection();
    const normalizedScreenEdge = normalizeScreenEdge();
    const normalizedElementEdge = normalizeElementEdge();
    // 规范化 closeModes
    const closeModesArray = Array.isArray(closeModes) ? closeModes : [closeModes];
    const canCloseByBackButton = closeModesArray.includes('backButton') && showBackButton;
    const canCloseByClickOutside = closeModesArray.includes('clickOutside');
    // 计算抽屉的样式（位置和大小）
    const getDrawerStyle = () => {
        const baseStyle = {
            position: 'fixed',
            zIndex: 1000,
            maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
        };
        // 根据源和方向计算位置
        if (source === 'element' && elementRef?.current && elementPosition) {
            const pos = elementPosition;
            switch (normalizedElementEdge) {
                case 'top':
                    baseStyle.top = pos.top;
                    baseStyle.left = pos.left;
                    baseStyle.width = pos.width;
                    break;
                case 'bottom':
                    baseStyle.top = pos.top + pos.height;
                    baseStyle.left = pos.left;
                    baseStyle.width = pos.width;
                    break;
                case 'left':
                    baseStyle.left = pos.left;
                    baseStyle.top = pos.top;
                    baseStyle.height = pos.height;
                    break;
                case 'right':
                    baseStyle.left = pos.left + pos.width;
                    baseStyle.top = pos.top;
                    baseStyle.height = pos.height;
                    break;
            }
        }
        else {
            // 屏幕边缘位置
            switch (normalizedScreenEdge) {
                case 'top':
                    baseStyle.top = 0;
                    baseStyle.left = 0;
                    baseStyle.right = 0;
                    break;
                case 'bottom':
                    baseStyle.bottom = 0;
                    baseStyle.left = 0;
                    baseStyle.right = 0;
                    break;
                case 'left':
                    baseStyle.left = 0;
                    baseStyle.top = 0;
                    baseStyle.bottom = 0;
                    break;
                case 'right':
                    baseStyle.right = 0;
                    baseStyle.top = 0;
                    baseStyle.bottom = 0;
                    break;
            }
        }
        return baseStyle;
    };
    // 获取抽屉的 CSS 类名
    const getDrawerClassName = () => {
        const classes = [styles.drawer];
        classes.push(styles[`direction-${normalizedDirection}`]);
        if (visible)
            classes.push(styles.active);
        return classes.join(' ');
    };
    // 监听元素位置变化
    useEffect(() => {
        if (source !== 'element' || !elementRef?.current)
            return;
        const updatePosition = () => {
            const rect = elementRef.current?.getBoundingClientRect();
            if (rect) {
                setElementPosition({
                    top: rect.top,
                    left: rect.left,
                    width: rect.width,
                    height: rect.height,
                });
            }
        };
        updatePosition();
        window.addEventListener('resize', updatePosition);
        window.addEventListener('scroll', updatePosition);
        return () => {
            window.removeEventListener('resize', updatePosition);
            window.removeEventListener('scroll', updatePosition);
        };
    }, [source, elementRef]);
    // 处理 toggleRef 的点击事件 - 实现点击同一按钮切换 drawer 的功能
    useEffect(() => {
        if (!toggleRef?.current)
            return;
        const handleToggleClick = (e) => {
            e.stopPropagation();
            if (visibleRef.current) {
                // 已打开，则关闭
                onCloseRef.current();
            }
            else {
                // 未打开，则通知父组件打开
                onToggle?.(true);
            }
        };
        toggleRef.current.addEventListener('click', handleToggleClick);
        return () => {
            toggleRef.current?.removeEventListener('click', handleToggleClick);
        };
    }, [toggleRef, onToggle]);
    // 注册/注销 drawer 到上下文，并处理互斥逻辑
    useEffect(() => {
        if (!drawerContext)
            return;
        // 注册当前 drawer，使用 ref 中的最新 onClose
        drawerContext.registerDrawer({
            id: drawerId,
            onClose: () => onCloseRef.current(),
        });
        return () => {
            // 模组卸载时注销
            drawerContext.unregisterDrawer(drawerId);
        };
    }, [drawerContext, drawerId]);
    // 当 drawer 打开时，关闭其他所有 drawer
    useEffect(() => {
        if (!visible || !drawerContext)
            return;
        drawerContext.openDrawer(drawerId);
    }, [visible, drawerContext, drawerId]);
    // 处理返回按钮点击
    const handleBackButtonClick = () => {
        if (canCloseByBackButton) {
            onCloseRef.current();
        }
    };
    // 处理遮罩层点击
    const handleOverlayClick = () => {
        if (canCloseByClickOutside) {
            onCloseRef.current();
        }
    };
    return createPortal(_jsxs(_Fragment, { children: [overlay && (_jsx("div", { className: `${styles.overlay} ${visible ? styles.active : ''}`, onClick: handleOverlayClick })), _jsxs("div", { ref: drawerRef, className: getDrawerClassName(), style: getDrawerStyle(), children: [showHeader && (_jsxs("div", { className: styles.header, children: [showBackButton && (_jsx("button", { className: styles.backBtn, onClick: handleBackButtonClick, "aria-label": "\u8FD4\u56DE", children: _jsx("button", { className: styles.closeBtn, onClick: onClose, children: "\u2715" }) })), _jsx("h2", { className: styles.title, children: title || '' }), _jsx("div", { className: styles.placeholder })] })), _jsx("div", { className: styles.content, children: children })] })] }), document.body);
};
export default SlideDrawer;
//# sourceMappingURL=index.js.map
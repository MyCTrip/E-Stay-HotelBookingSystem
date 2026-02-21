/**
 * 滑出容器组件 - 增强版，支持多方向、多位置和多种关闭模式
 * 向上/下/左/右滑出，支持屏幕边缘和元素边缘两种位置模式
 * 同一页面内自动互斥
 */
import React, { ReactNode } from 'react';
export { SlideDrawerProvider } from './context';
type Edge = 'top' | 'bottom' | 'left' | 'right';
type Source = 'screen' | 'element';
type CloseMode = 'backButton' | 'clickOutside' | 'none';
type LegacyDirection = 'up' | 'down' | 'left' | 'right' | 'bottom' | 'top';
interface SlideDrawerProps {
    visible: boolean;
    children: ReactNode;
    title?: string;
    maxHeight?: string | number;
    onClose: () => void;
    direction?: LegacyDirection;
    source?: Source;
    screenEdge?: Edge;
    elementRef?: React.RefObject<HTMLElement>;
    elementEdge?: Edge;
    position?: 'top' | 'center' | 'bottom';
    closeModes?: CloseMode | CloseMode[];
    showBackButton?: boolean;
    showHeader?: boolean;
    overlay?: boolean;
    toggleRef?: React.RefObject<HTMLElement>;
    onToggle?: (isOpen: boolean) => void;
}
declare const SlideDrawer: React.FC<SlideDrawerProps>;
export default SlideDrawer;
//# sourceMappingURL=index.d.ts.map
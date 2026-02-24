/**
 * 底部滑入容器组件 - 高度自适应
 * 从网页窗口底部滑入，最高占 70% 屏幕高度，顶部圆角
 */
import React, { ReactNode } from 'react';
interface BottomDrawerProps {
    visible: boolean;
    title?: string;
    maxHeight?: string | number;
    onClose: () => void;
    showBackButton?: boolean;
    showHeader?: boolean;
    children: ReactNode;
}
declare const BottomDrawer: React.FC<BottomDrawerProps>;
export default BottomDrawer;
//# sourceMappingURL=index.d.ts.map
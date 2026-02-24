/**
 * 悬浮操作按钮 - 回到顶部、地图切换
 */
import React from 'react';
interface FloatingActionButtonsProps {
    scrollTop: number;
    containerHeight: number;
    containerScrollHeight: number;
    onScrollToTop: () => void;
    onToggleMap?: () => void;
    showMapButton?: boolean;
}
declare const FloatingActionButtons: React.FC<FloatingActionButtonsProps>;
export default FloatingActionButtons;
//# sourceMappingURL=index.d.ts.map
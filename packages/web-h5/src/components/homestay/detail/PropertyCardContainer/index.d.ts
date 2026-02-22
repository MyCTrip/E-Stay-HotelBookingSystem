/**
 * 房源卡片容器 - 提供卡片样式、标签、展开按钮、Header 区域
 */
import React from 'react';
interface HeaderConfig {
    show?: boolean;
    title?: {
        text: string;
        show: boolean;
    };
    textButton?: {
        text: string;
        show: boolean;
        onClick: () => void;
    };
    tipTag?: {
        show: boolean;
        icon: React.ComponentType<{
            width: number;
            height: number;
        }>;
        text: string;
    };
}
interface PropertyCardContainerProps {
    children: React.ReactNode;
    headerConfig?: HeaderConfig;
    showLabel?: boolean;
    labelText?: string;
    tooltipText?: string;
    showExpandBtn?: boolean;
    expandBtnText?: string;
    isExpanded?: boolean;
    onExpandToggle?: () => void;
}
declare const PropertyCardContainer: React.FC<PropertyCardContainerProps>;
export default PropertyCardContainer;
//# sourceMappingURL=index.d.ts.map
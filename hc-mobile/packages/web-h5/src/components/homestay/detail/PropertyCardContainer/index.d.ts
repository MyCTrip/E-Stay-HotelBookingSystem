/**
 * 房源卡片容器 - 提供卡片样式、标签、展开按钮
 */
import React from 'react';
interface PropertyCardContainerProps {
    children: React.ReactNode;
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
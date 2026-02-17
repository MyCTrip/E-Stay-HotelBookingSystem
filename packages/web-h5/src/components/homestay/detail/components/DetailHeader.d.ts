/**
 * 详情页顶部操作栏 - 固定吸顶
 * 初始透明，滚动超过图片区时变为不透明白色
 */
import React from 'react';
interface DetailHeaderProps {
    data: any;
    opacity: number;
    onCollectionChange?: () => void;
    onShare?: () => void;
}
declare const DetailHeader: React.ForwardRefExoticComponent<DetailHeaderProps & React.RefAttributes<HTMLDivElement>>;
export default DetailHeader;
//# sourceMappingURL=DetailHeader.d.ts.map
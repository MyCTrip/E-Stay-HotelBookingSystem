/**
 * 推荐类型区域组件
 * 展示多个推荐类型卡片的容器，支持灵活的布局配置
 */
import React from 'react';
import { RecommendTypeCardProps } from '../RecommendTypeCard';
export interface RecommendTypesProps {
    items?: RecommendTypeCardProps[];
    columns?: number;
    gap?: number | string;
    padding?: number | string;
    className?: string;
}
declare const _default: React.NamedExoticComponent<RecommendTypesProps>;
export default _default;
//# sourceMappingURL=index.d.ts.map
/**
 * 民宿推荐卡片组件
 * 左图右文布局，显示民宿基本信息
 * 遵循规范：
 * - 卡片圆角8-12pt，内边距8-12pt
 * - 图片自适应高度
 * - 不显示评分
 */
import React from 'react';
import type { HomeStay } from '@estay/shared';
interface RecommendCardProps {
    homestay: HomeStay;
    onClick?: (homestay: HomeStay) => void;
}
declare const _default: React.NamedExoticComponent<RecommendCardProps>;
export default _default;
//# sourceMappingURL=index.d.ts.map
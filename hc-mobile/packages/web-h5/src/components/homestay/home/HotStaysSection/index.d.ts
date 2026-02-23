/**
 * 热门民宿推荐区组件 - Web H5版本
 */
import React from 'react';
import type { HomeStay } from '@estay/shared';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
interface HotStaysSectionProps {
    title?: string;
    data: HomeStay[];
    onCardClick?: (id: string) => void;
    loading?: boolean;
}
declare const _default: React.NamedExoticComponent<HotStaysSectionProps>;
export default _default;
//# sourceMappingURL=index.d.ts.map
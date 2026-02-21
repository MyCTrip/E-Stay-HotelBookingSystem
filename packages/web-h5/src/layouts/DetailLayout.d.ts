/**
 * 民宿详情页专用Layout
 * 三层结构：固定Header + 固定Tabs导航 + 可滚动内容 + 固定Footer
 */
import React, { ReactNode } from 'react';
export type DetailTabKey = 'overview' | 'rooms' | 'reviews' | 'facilities' | 'policies' | 'knowledge' | 'nearby' | 'host';
interface DetailLayoutProps {
    /** 主要内容区域 */
    children: ReactNode;
    /** 导航Tabs组件 */
    tabs: ReactNode;
    /** 底部预订栏组件 */
    footer: ReactNode;
    /** 当前激活的Tab */
    activeTab: DetailTabKey;
    /** Tab变更回调 */
    onTabChange: (tab: DetailTabKey) => void;
    /** 页面数据 */
    data?: any;
    /** 房东联系回调 */
    onContactHost?: () => void;
    /** 返回按钮点击 */
    onBack?: () => void;
    /** 分享按钮点击 */
    onShare?: () => void;
    /** 收藏状态变更 */
    onCollectionChange?: () => void;
}
/**
 * Section引用类型，用于滚动定位
 */
export interface SectionRefs {
    overview?: React.RefObject<HTMLDivElement>;
    rooms?: React.RefObject<HTMLDivElement>;
    reviews?: React.RefObject<HTMLDivElement>;
    facilities?: React.RefObject<HTMLDivElement>;
    policies?: React.RefObject<HTMLDivElement>;
    knowledge?: React.RefObject<HTMLDivElement>;
    nearby?: React.RefObject<HTMLDivElement>;
    host?: React.RefObject<HTMLDivElement>;
}
declare const DetailLayout: React.ForwardRefExoticComponent<DetailLayoutProps & React.RefAttributes<HTMLDivElement>>;
export default DetailLayout;
export declare const createSectionRef: () => React.RefObject<HTMLDivElement>;
//# sourceMappingURL=DetailLayout.d.ts.map
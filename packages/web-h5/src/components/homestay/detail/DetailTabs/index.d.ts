/**
 * 吸顶导航Tab栏
 */
import React from 'react';
export type TabKey = 'overview' | 'rooms' | 'reviews' | 'facilities' | 'policies' | 'knowledge' | 'nearby' | 'host';
interface DetailTabsProps {
    activeTab?: TabKey;
    onChange?: (tab: TabKey) => void;
}
declare const DetailTabs: React.FC<DetailTabsProps>;
export default DetailTabs;
//# sourceMappingURL=index.d.ts.map
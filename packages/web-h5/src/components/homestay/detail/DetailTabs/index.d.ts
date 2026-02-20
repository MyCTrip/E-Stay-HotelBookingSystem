/**
 * 吸顶导航Tab栏
 */
import React from 'react';
export type TabKey = 'rooms' | 'facilities' | 'reviews' | 'policies' | 'nearby';
interface DetailTabsProps {
    activeTab: TabKey;
    onChange: (tab: TabKey) => void;
}
declare const DetailTabs: React.FC<DetailTabsProps>;
export default DetailTabs;
//# sourceMappingURL=index.d.ts.map
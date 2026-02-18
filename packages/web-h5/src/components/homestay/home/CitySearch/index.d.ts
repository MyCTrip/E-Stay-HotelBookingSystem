/**
 * 城市搜索组件 - 城市选择抽屉
 * 从网页窗口底部滑入，占 70% 屏幕高度，顶部圆角
 */
import React from 'react';
interface CitySearchProps {
    visible: boolean;
    currentCity?: string;
    onSelect: (city: string) => void;
    onClose: () => void;
}
declare const CitySearch: React.FC<CitySearchProps>;
export default CitySearch;
//# sourceMappingURL=index.d.ts.map
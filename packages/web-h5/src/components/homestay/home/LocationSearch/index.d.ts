/**
 * 位置搜索组件 - 景点/地标/房源搜索
 * 从网页窗口底部滑入，占 70% 屏幕高度，顶部圆角
 */
import React from 'react';
interface LocationSearchProps {
    visible: boolean;
    onSelect: (location: string) => void;
    onClose: () => void;
}
declare const LocationSearch: React.FC<LocationSearchProps>;
export default LocationSearch;
//# sourceMappingURL=index.d.ts.map
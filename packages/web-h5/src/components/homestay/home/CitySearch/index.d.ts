/**
 * 城市搜索组件 - 只提供搜索内容，UI 容器由父组件提供
 */
import React from 'react';
interface CitySearchProps {
    currentCity?: string;
    onSelect: (city: string) => void;
    onClose: () => void;
}
declare const CitySearch: React.FC<CitySearchProps>;
export default CitySearch;
//# sourceMappingURL=index.d.ts.map
/**
 * 搜索条件栏 - SearchResultHeader 下方
 * 包含：城市选择、入离时间选择、地址搜索栏
 */
import React from 'react';
interface SearchBarProps {
    initialCity?: string;
    initialCheckIn?: Date;
    initialCheckOut?: Date;
    initialLocation?: string;
    onCityChange?: (city: string) => void;
    onDateChange?: (checkIn: Date, checkOut: Date) => void;
    onLocationChange?: (location: string) => void;
}
declare const SearchBar: React.FC<SearchBarProps>;
export default SearchBar;
//# sourceMappingURL=index.d.ts.map
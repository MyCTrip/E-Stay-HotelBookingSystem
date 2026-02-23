import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 搜索条件栏 - SearchResultHeader 下方
 * 包含：城市选择、入离时间选择、地址搜索栏
 */
import { useState } from 'react';
import dayjs from 'dayjs';
import SlideDrawer from '../../shared/SlideDrawer';
import CitySearch from '../../home/CitySearch';
import DateRangeCalendar from '../../home/DateRangeCalendar';
import LocationSearch from '../../home/LocationSearch';
import styles from './index.module.scss';
const SearchBar = ({ initialCity = '上海', initialCheckIn, initialCheckOut, initialLocation = '', onCityChange, onDateChange, onLocationChange, }) => {
    const [city, setCity] = useState(initialCity);
    const [checkIn, setCheckIn] = useState(initialCheckIn);
    const [checkOut, setCheckOut] = useState(initialCheckOut);
    const [location, setLocation] = useState(initialLocation);
    // 弹窗状态
    const [showCitySearch, setShowCitySearch] = useState(false);
    const [showDateRange, setShowDateRange] = useState(false);
    const [showLocationSearch, setShowLocationSearch] = useState(false);
    const handleCitySelect = (selectedCity) => {
        setCity(selectedCity);
        onCityChange?.(selectedCity);
        setShowCitySearch(false);
    };
    const handleDateSelect = (selectedCheckIn, selectedCheckOut) => {
        setCheckIn(selectedCheckIn);
        setCheckOut(selectedCheckOut);
        onDateChange?.(selectedCheckIn, selectedCheckOut);
        setShowDateRange(false);
    };
    const handleLocationSelect = (selectedLocation) => {
        setLocation(selectedLocation);
        onLocationChange?.(selectedLocation);
        setShowLocationSearch(false);
    };
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: styles.searchBar, children: _jsxs("div", { className: styles.content, children: [_jsx("button", { className: styles.cityBtn, onClick: () => setShowCitySearch(true), children: _jsx("div", { className: styles.buttonValue, children: city }) }), _jsxs("button", { className: styles.dateBtn, onClick: () => setShowDateRange(true), children: [_jsxs("div", { className: styles.dateRowUp, children: [_jsx("span", { className: styles.dateLabel, children: "\u4F4F" }), _jsx("span", { className: styles.dateValue, children: checkIn ? dayjs(checkIn).format('M/DD') : '未选择' })] }), _jsxs("div", { className: styles.dateRowDown, children: [_jsx("span", { className: styles.dateLabel, children: "\u79BB" }), _jsx("span", { className: styles.dateValue, children: checkOut ? dayjs(checkOut).format('M/DD') : '未选择' })] })] }), _jsxs("button", { className: styles.locationBtn, onClick: () => setShowLocationSearch(true), children: [_jsxs("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", className: styles.searchIcon, children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.35-4.35", strokeLinecap: "round" })] }), _jsx("input", { type: "text", className: styles.locationInput, placeholder: `${city}的景点，地标，房源`, value: location, readOnly: true, onClick: () => setShowLocationSearch(true) })] })] }) }), _jsx(SlideDrawer, { visible: showCitySearch, title: "\u57CE\u5E02\u641C\u7D22", direction: "up", position: "bottom", onClose: () => setShowCitySearch(false), children: _jsx(CitySearch, { currentCity: city, onSelect: handleCitySelect, onClose: () => setShowCitySearch(false) }) }), _jsx(SlideDrawer, { visible: showDateRange, title: "\u9009\u62E9\u5165\u79BB\u65E5\u671F", direction: "up", position: "bottom", onClose: () => setShowDateRange(false), children: _jsx(DateRangeCalendar, { checkIn: checkIn, checkOut: checkOut, onSelect: handleDateSelect, onClose: () => setShowDateRange(false) }) }), _jsx(SlideDrawer, { visible: showLocationSearch, title: "\u641C\u7D22\u4F4D\u7F6E", direction: "up", position: "bottom", onClose: () => setShowLocationSearch(false), children: _jsx(LocationSearch, { onSelect: handleLocationSelect, onClose: () => setShowLocationSearch(false) }) })] }));
};
export default SearchBar;
//# sourceMappingURL=index.js.map
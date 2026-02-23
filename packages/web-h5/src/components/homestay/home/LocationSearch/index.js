import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 位置搜索组件 - 景点/地标/房源搜索，只提供内容
 */
import { useState } from 'react';
import styles from './index.module.scss';
const SEARCH_CATEGORIES = [
    { icon: '🏞️', label: '景点' },
    { icon: '🏛️', label: '地标' },
    { icon: '🏠', label: '房源' },
    { icon: '🏨', label: '酒店' },
];
const LOCATION_SUGGESTIONS = [
    '西湖公园',
    '西街/开元寺',
    '万达（浦西店）',
    '泉州古城',
    '西湖公园',
    '丰泽区',
    '蜂埠村',
];
const LocationSearch = ({ onSelect, onClose }) => {
    const [searchText, setSearchText] = useState('');
    const [searchHistory, setSearchHistory] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const handleInputChange = (e) => {
        const text = e.target.value;
        setSearchText(text);
        if (text.trim()) {
            const results = LOCATION_SUGGESTIONS.filter((item) => item.toLowerCase().includes(text.toLowerCase()));
            setSearchResults(results);
        }
        else {
            setSearchResults([]);
        }
    };
    const handleLocationSelect = (location) => {
        setSearchHistory([location, ...searchHistory.filter((h) => h !== location)]);
        onSelect(location);
        setSearchText('');
        setSearchResults([]);
        onClose();
    };
    const handleClearHistory = () => {
        setSearchHistory([]);
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.searchBox, children: [_jsxs("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", className: styles.searchIcon, children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.35-4.35", strokeLinecap: "round" })] }), _jsx("input", { type: "text", className: styles.searchInput, placeholder: "\u641C\u7D22\u6CC9\u5DDE\u7684\u666F\u70B9\u3001\u5730\u6807\u3001\u623F\u6E90", value: searchText, onChange: handleInputChange, autoFocus: true }), searchText && (_jsx("button", { className: styles.clearBtn, onClick: () => {
                            setSearchText('');
                            setSearchResults([]);
                        }, children: _jsx("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "currentColor", children: _jsx("path", { d: "M18 6L6 18M6 6l12 12", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }) }) }))] }), !searchText && (_jsx("div", { className: styles.categoriesSection, children: _jsx("div", { className: styles.categoriesGrid, children: SEARCH_CATEGORIES.map((cat) => (_jsxs("button", { className: styles.categoryItem, onClick: () => handleLocationSelect(cat.label), children: [_jsx("div", { className: styles.categoryIcon, children: cat.icon }), _jsx("div", { className: styles.categoryLabel, children: cat.label })] }, cat.label))) }) })), _jsx("div", { className: styles.contentContainer, children: searchText ? (
                // 搜索结果
                searchResults.length > 0 ? (_jsx("div", { className: styles.resultsSection, children: searchResults.map((result) => (_jsxs("button", { className: styles.resultItem, onClick: () => handleLocationSelect(result), children: [_jsxs("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", className: styles.resultIcon, children: [_jsx("path", { d: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z", strokeWidth: 2, strokeLinecap: "round" }), _jsx("circle", { cx: "12", cy: "10", r: "3", fill: "currentColor" })] }), _jsx("span", { children: result })] }, result))) })) : (_jsx("div", { className: styles.empty, children: "\u672A\u627E\u5230\u76F8\u5173\u4F4D\u7F6E" }))) : (
                // 搜索历史
                searchHistory.length > 0 && (_jsxs("div", { className: styles.historySection, children: [_jsxs("div", { className: styles.historyHeader, children: [_jsx("span", { className: styles.historyTitle, children: "\u641C\u7D22\u5386\u53F2" }), _jsx("button", { className: styles.clearHistoryBtn, onClick: handleClearHistory, children: "\u6E05\u7A7A" })] }), _jsx("div", { className: styles.historyList, children: searchHistory.map((history) => (_jsxs("button", { className: styles.historyItem, onClick: () => handleLocationSelect(history), children: [_jsxs("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", className: styles.historyIcon, children: [_jsx("circle", { cx: "12", cy: "12", r: "10", strokeWidth: 2 }), _jsx("polyline", { points: "12 6 12 12 16 14", strokeWidth: 2, strokeLinecap: "round" })] }), _jsx("span", { children: history })] }, history))) })] }))) })] }));
};
export default LocationSearch;
//# sourceMappingURL=index.js.map
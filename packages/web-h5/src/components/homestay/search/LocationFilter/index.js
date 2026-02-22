import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 位置筛选组件 - 内容only
 */
import { useState } from 'react';
import styles from './index.module.scss';
const categories = [
    { label: '热门推荐', icon: '★' },
    { label: '观光景点', icon: '🏛️' },
    { label: '商圈', icon: '🛍️' },
    { label: '行政区', icon: '🗺️' },
    { label: '机场/车站', icon: '✈️' },
    { label: '高校', icon: '🎓' },
    { label: '医院', icon: '🏥' },
];
const locations = {
    热门推荐: [
        { name: '西湖公园', count: '历史搜过' },
        { name: '泉州欧乐堡度假区', count: '1.5%用户选择' },
        { name: '泉州西街', count: '27.6%用户选择' },
    ],
    观光景点: [{ name: '西街/开元寺', count: '13.2%用户选择' }],
    商圈: [{ name: '南昌街', count: '5.2%用户选择' }],
    行政区: [{ name: '洛阳区', count: '8.9%用户选择' }],
    '机场/车站': [{ name: '首都国际机场', count: '2.1%用户选择' }],
    高校: [{ name: '清华大学', count: '1.2%用户选择' }],
    医院: [{ name: '协和医院', count: '0.8%用户选择' }],
};
const LocationFilter = ({ selectedLocation = '', onLocationChange, }) => {
    const [activeCategory, setActiveCategory] = useState('热门推荐');
    const [searchText, setSearchText] = useState('');
    const currentLocations = locations[activeCategory] || [];
    const handleLocationSelect = (location) => {
        onLocationChange?.(location);
    };
    return (_jsxs("div", { className: styles.locationFilter, children: [_jsx("div", { className: styles.searchBox, children: _jsx("input", { type: "text", placeholder: "\u8F93\u5165\u4F4D\u7F6E\u3001\u5730\u70B9\u3001\u5730\u5740", value: searchText, onChange: (e) => setSearchText(e.target.value), className: styles.searchInput }) }), _jsx("div", { className: styles.categoryNav, children: _jsx("ul", { className: styles.categoryList, children: categories.map((cat) => (_jsx("li", { className: styles.categoryItem, children: _jsxs("button", { className: `${styles.categoryBtn} ${activeCategory === cat.label ? styles.active : ''}`, onClick: () => setActiveCategory(cat.label), children: [_jsx("span", { className: styles.icon, children: cat.icon }), _jsx("span", { className: styles.name, children: cat.label })] }) }, cat.label))) }) }), _jsx("div", { className: styles.locationList, children: currentLocations.map((loc) => (_jsxs("div", { className: `${styles.locationItem} ${selectedLocation === loc.name ? styles.selected : ''}`, onClick: () => handleLocationSelect(loc.name), children: [_jsx("div", { className: styles.locationName, children: loc.name }), _jsx("div", { className: styles.locationCount, children: loc.count })] }, loc.name))) }), _jsx("div", { className: styles.footer, children: _jsx("button", { className: styles.clearBtn, onClick: () => handleLocationSelect(''), children: "\u6E05\u7A7A" }) })] }));
};
export default LocationFilter;
//# sourceMappingURL=index.js.map
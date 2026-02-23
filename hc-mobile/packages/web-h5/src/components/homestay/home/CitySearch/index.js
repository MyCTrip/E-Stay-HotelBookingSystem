import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 城市搜索组件 - 只提供搜索内容，UI 容器由父组件提供
 */
import { useState, useMemo } from 'react';
import styles from './index.module.scss';
const HOT_CITIES = ['北京', '成都', '上海', '香港', '澳门', '重庆', '广州', '深圳'];
const ALL_CITIES = [
    '北京',
    '成都',
    '上海',
    '香港',
    '澳门',
    '重庆',
    '广州',
    '深圳',
    '杭州',
    '南京',
    '武汉',
    '西安',
    '苏州',
    '天津',
    '长沙',
    '青岛',
    '厦门',
    '宁波',
    '郑州',
    '沈阳',
    '济南',
    '哈尔滨',
    '太原',
    '石家庄',
    '大连',
    '昆明',
    '南昌',
    '福州',
    '贵阳',
    '兰州',
    '海口',
    '银川',
    '呼和浩特',
    '拉萨',
    '南宁',
    '乌鲁木齐',
];
const getCityPinyin = {
    北京: 'beijing',
    成都: 'chengdu',
    上海: 'shanghai',
    香港: 'hongkong',
    澳门: 'aomen',
    重庆: 'chongqing',
    广州: 'guangzhou',
    深圳: 'shenzhen',
    杭州: 'hangzhou',
    南京: 'nanjing',
    武汉: 'wuhan',
    西安: 'xian',
    苏州: 'suzhou',
    天津: 'tianjin',
    长沙: 'changsha',
    青岛: 'qingdao',
    厦门: 'xiamen',
    宁波: 'ningbo',
    郑州: 'zhengzhou',
    沈阳: 'shenyang',
    济南: 'jinan',
    哈尔滨: 'haerbin',
    太原: 'taiyuan',
    石家庄: 'shijiazhuang',
    大连: 'dalian',
    昆明: 'kunming',
    南昌: 'nanchang',
    福州: 'fuzhou',
    贵阳: 'guiyang',
    兰州: 'lanzhou',
    海口: 'haikou',
    银川: 'yinchuan',
    呼和浩特: 'huhehaote',
    拉萨: 'lasa',
    南宁: 'nanning',
    乌鲁木齐: 'wulumuqi',
};
const CitySearch = ({ currentCity = '上海', onSelect, onClose }) => {
    const [searchText, setSearchText] = useState('');
    // 按首字母分组
    const groupedCities = useMemo(() => {
        let filtered = ALL_CITIES;
        if (searchText.trim()) {
            const query = searchText.toLowerCase();
            filtered = ALL_CITIES.filter((city) => {
                const pinyin = getCityPinyin[city] || '';
                return city.includes(searchText) || pinyin.includes(query);
            });
        }
        const groups = {};
        filtered.forEach((city) => {
            const pinyin = getCityPinyin[city] || '';
            const firstChar = pinyin[0]?.toUpperCase() || '#';
            if (!groups[firstChar]) {
                groups[firstChar] = [];
            }
            groups[firstChar].push(city);
        });
        return groups;
    }, [searchText]);
    const letters = Object.keys(groupedCities).sort();
    const handleCityClick = (city) => {
        onSelect(city);
        setSearchText('');
    };
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.searchBox, children: [_jsxs("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "none", stroke: "currentColor", className: styles.searchIcon, children: [_jsx("circle", { cx: "11", cy: "11", r: "8" }), _jsx("path", { d: "m21 21-4.35-4.35", strokeLinecap: "round" })] }), _jsx("input", { type: "text", className: styles.searchInput, placeholder: "\u57CE\u5E02/\u533A\u57DF/\u4F4D\u7F6E", value: searchText, onChange: (e) => setSearchText(e.target.value), autoFocus: true }), searchText && (_jsx("button", { className: styles.clearBtn, onClick: () => setSearchText(''), children: _jsx("svg", { viewBox: "0 0 24 24", width: "18", height: "18", fill: "currentColor", children: _jsx("path", { d: "M18 6L6 18M6 6l12 12", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" }) }) }))] }), _jsx("div", { className: styles.tabs, children: _jsx("div", { className: `${styles.tab} ${styles.active}`, children: "\u56FD\u5185(\u542B\u6E2F\u6FB3\u53F0)" }) }), !searchText && (_jsxs("div", { className: styles.hotCities, children: [_jsx("div", { className: styles.sectionTitle, children: "\u70ED\u95E8\u57CE\u5E02" }), _jsx("div", { className: styles.citiesList, children: HOT_CITIES.map((city) => (_jsx("button", { className: `${styles.cityBtn} ${city === currentCity ? styles.active : ''}`, onClick: () => handleCityClick(city), children: city }, city))) })] })), _jsx("div", { className: styles.cityListContainer, children: letters.length > 0 ? (letters.map((letter) => (_jsxs("div", { className: styles.cityGroup, children: [_jsx("div", { className: styles.groupHeader, children: letter }), _jsx("div", { className: styles.groupCities, children: groupedCities[letter].map((city) => (_jsx("button", { className: `${styles.cityItem} ${city === currentCity ? styles.active : ''}`, onClick: () => handleCityClick(city), children: city }, city))) })] }, letter)))) : (_jsx("div", { className: styles.empty, children: "\u672A\u627E\u5230\u5339\u914D\u7684\u57CE\u5E02" })) })] }));
};
export default CitySearch;
//# sourceMappingURL=index.js.map
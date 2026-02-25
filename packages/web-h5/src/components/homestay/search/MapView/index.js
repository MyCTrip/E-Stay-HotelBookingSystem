import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './index.module.scss';
const MapView = ({ data = [], filters, onMarkerClick, }) => {
    // 获取城市坐标（示例数据）
    const cityCoordinates = {
        北京: { lat: 39.9042, lng: 116.4074 },
        上海: { lat: 31.2304, lng: 121.4737 },
        广州: { lat: 23.1291, lng: 113.2644 },
        深圳: { lat: 22.5431, lng: 114.0579 },
        杭州: { lat: 30.2741, lng: 120.1551 },
        成都: { lat: 30.5728, lng: 104.0668 },
        南京: { lat: 32.0603, lng: 118.7969 },
        武汉: { lat: 30.5928, lng: 114.3055 },
        西安: { lat: 34.3416, lng: 108.9398 },
        重庆: { lat: 29.4316, lng: 106.9123 },
    };
    const city = filters?.city || '上海';
    const center = cityCoordinates[city] || cityCoordinates['上海'];
    return (_jsxs("div", { className: styles.mapViewContainer, children: [_jsxs("div", { className: styles.mapContainer, children: [_jsxs("div", { className: styles.mapPlaceholder, children: [_jsx("div", { className: styles.iconWrapper, children: "\uD83D\uDDFA\uFE0F" }), _jsx("h2", { className: styles.title, children: "\u5730\u56FE\u89C6\u56FE" }), _jsxs("p", { className: styles.description, children: ["\u663E\u793A ", city, " \u7684 ", data.length, " \u4E2A\u6C11\u5BBF\u4F4D\u7F6E"] }), _jsx("div", { className: styles.comingSoon, children: "\u5373\u5C06\u4E0A\u7EBF" }), _jsx("p", { className: styles.hint, children: "\u5730\u56FE\u529F\u80FD\u6B63\u5728\u5F00\u53D1\u4E2D\uFF0C\u656C\u8BF7\u671F\u5F85..." })] }), _jsx("div", { className: styles.infoPanelWrapper, children: _jsxs("div", { className: styles.infoPanel, children: [_jsxs("div", { className: styles.stat, children: [_jsx("span", { className: styles.number, children: data.length }), _jsx("span", { className: styles.label, children: "\u6C11\u5BBF" })] }), _jsxs("div", { className: styles.stat, children: [_jsx("span", { className: styles.number, children: city }), _jsx("span", { className: styles.label, children: "\u57CE\u5E02" })] }), filters?.checkInDate && (_jsxs("div", { className: styles.stat, children: [_jsx("span", { className: styles.date, children: filters.checkInDate }), _jsx("span", { className: styles.label, children: "\u5165\u4F4F" })] }))] }) })] }), _jsx("div", { className: styles.footer, children: _jsx("p", { children: "\uD83D\uDCA1 \u63D0\u793A\uFF1A\u5207\u6362\u56DE\u5217\u8868\u89C6\u56FE\u67E5\u770B\u8BE6\u7EC6\u4FE1\u606F" }) })] }));
};
export default MapView;
//# sourceMappingURL=index.js.map
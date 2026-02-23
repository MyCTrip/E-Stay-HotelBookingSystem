import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.css';
/**
 * 钟点房首页
 */
export default function HomeHourlyHotelPage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        city: 'Beijing',
        checkIn: new Date().toISOString().split('T')[0],
        checkOut: new Date().toISOString().split('T')[0],
        checkInTime: '14:00',
        checkOutTime: '18:00',
        guests: 2,
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'guests' ? parseInt(value) : value,
        }));
    };
    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(Object.entries(formData).reduce((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
        }, {}));
        navigate(`/search/hourlyHotel?${params.toString()}`);
    };
    return (_jsxs("div", { className: styles.container, children: [_jsx("section", { className: styles.banner, children: _jsxs("div", { className: styles.bannerContent, children: [_jsx("h1", { children: "\u53D1\u73B0\u60A8\u7684\u949F\u70B9\u623F" }), _jsx("p", { children: "\u5728\u5168\u56FD\u591A\u5BB6\u949F\u70B9\u623F\u4E2D\u641C\u7D22" })] }) }), _jsx("section", { className: styles.searchSection, children: _jsxs("form", { onSubmit: handleSearch, className: styles.searchForm, children: [_jsxs("div", { className: styles.formGroup, children: [_jsx("label", { htmlFor: "city", children: "\u76EE\u7684\u5730" }), _jsxs("select", { id: "city", name: "city", value: formData.city, onChange: handleChange, className: styles.input, children: [_jsx("option", { value: "Beijing", children: "\u5317\u4EAC" }), _jsx("option", { value: "Shanghai", children: "\u4E0A\u6D77" }), _jsx("option", { value: "Guangzhou", children: "\u5E7F\u5DDE" }), _jsx("option", { value: "Shenzhen", children: "\u6DF1\u5733" }), _jsx("option", { value: "Chengdu", children: "\u6210\u90FD" }), _jsx("option", { value: "Xian", children: "\u897F\u5B89" })] })] }), _jsxs("div", { className: styles.formGroup, children: [_jsx("label", { htmlFor: "checkIn", children: "\u65E5\u671F" }), _jsx("input", { id: "checkIn", type: "date", name: "checkIn", value: formData.checkIn, onChange: handleChange, className: styles.input, required: true })] }), _jsxs("div", { className: styles.formGroup, children: [_jsx("label", { htmlFor: "checkInTime", children: "\u5165\u4F4F\u65F6\u95F4" }), _jsx("input", { id: "checkInTime", type: "time", name: "checkInTime", value: formData.checkInTime, onChange: handleChange, className: styles.input, required: true })] }), _jsxs("div", { className: styles.formGroup, children: [_jsx("label", { htmlFor: "checkOutTime", children: "\u9000\u623F\u65F6\u95F4" }), _jsx("input", { id: "checkOutTime", type: "time", name: "checkOutTime", value: formData.checkOutTime, onChange: handleChange, className: styles.input, required: true })] }), _jsxs("div", { className: styles.formGroup, children: [_jsx("label", { htmlFor: "guests", children: "\u623F\u5BA2\u6570" }), _jsx("input", { id: "guests", type: "number", name: "guests", min: "1", max: "9", value: formData.guests, onChange: handleChange, className: styles.input, required: true })] }), _jsx("button", { type: "submit", className: styles.searchButton, children: "\u641C\u7D22" })] }) }), _jsxs("section", { className: styles.features, children: [_jsx("h2", { children: "\u4E3A\u4EC0\u4E48\u9009\u62E9\u6211\u4EEC\u7684\u949F\u70B9\u623F\uFF1F" }), _jsxs("div", { className: styles.featureGrid, children: [_jsxs("div", { className: styles.featureCard, children: [_jsx("div", { className: styles.icon, children: "\uD83D\uDCB0" }), _jsx("h3", { children: "\u7075\u6D3B\u5B9A\u4EF7" }), _jsx("p", { children: "\u6309\u5C0F\u65F6\u8BA1\u8D39\uFF0C\u7ECF\u6D4E\u5B9E\u60E0" })] }), _jsxs("div", { className: styles.featureCard, children: [_jsx("div", { className: styles.icon, children: "\uD83D\uDEE1\uFE0F" }), _jsx("h3", { children: "\u5B89\u5168\u9884\u8BA2" }), _jsx("p", { children: "\u6240\u6709\u4EA4\u6613\u5747\u53D7\u4FDD\u62A4" })] }), _jsxs("div", { className: styles.featureCard, children: [_jsx("div", { className: styles.icon, children: "\uD83E\uDD1D" }), _jsx("h3", { children: "24/7 \u652F\u6301" }), _jsx("p", { children: "\u968F\u65F6\u968F\u5730\u83B7\u5F97\u5E2E\u52A9" })] }), _jsxs("div", { className: styles.featureCard, children: [_jsx("div", { className: styles.icon, children: "\u2B50" }), _jsx("h3", { children: "\u771F\u5B9E\u8BC4\u4EF7" }), _jsx("p", { children: "\u771F\u5B9E\u5BA2\u4EBA\u7684\u771F\u5B9E\u8BC4\u4EF7" })] })] })] })] }));
}
//# sourceMappingURL=index.js.map
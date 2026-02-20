import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './StarFilter.module.scss';
const StarFilter = ({ selectedStars = [], onChange, }) => {
    const stars = [
        { value: 5, label: '5星' },
        { value: 4, label: '4-5星' },
        { value: 3, label: '3-4星' },
        { value: 2, label: '2-3星' },
        { value: 1, label: '1-2星' },
    ];
    const handleStarChange = (star) => {
        let newStars;
        if (selectedStars.includes(star)) {
            newStars = selectedStars.filter(s => s !== star);
        }
        else {
            newStars = [...selectedStars, star];
        }
        onChange?.(newStars);
    };
    const handleReset = () => {
        onChange?.([]);
    };
    return (_jsxs("div", { className: styles.starFilter, children: [_jsxs("div", { className: styles.header, children: [_jsx("h4", { className: styles.title, children: "\u661F\u7EA7\u8BC4\u5206" }), selectedStars.length > 0 && (_jsx("button", { className: styles.resetBtn, onClick: handleReset, children: "\u91CD\u7F6E" }))] }), _jsx("div", { className: styles.starList, children: stars.map((star) => (_jsxs("label", { className: styles.starItem, children: [_jsx("input", { type: "checkbox", checked: selectedStars.includes(star.value), onChange: () => handleStarChange(star.value), className: styles.checkbox }), _jsxs("div", { className: styles.content, children: [_jsx("span", { className: styles.rating, children: '⭐'.repeat(Math.min(star.value, 5)) }), _jsx("span", { className: styles.label, children: star.label })] }), selectedStars.includes(star.value) && (_jsx("span", { className: styles.checkmark, children: "\u2713" }))] }, star.value))) })] }));
};
export default StarFilter;
//# sourceMappingURL=StarFilter.js.map
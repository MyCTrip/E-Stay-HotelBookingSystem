import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * 地点输入组件 - Web H5版本
 */
import React, { useState, useRef } from 'react';
import styles from './index.module.scss';
const CITIES = ['上海', '北京', '广州', '深圳', '杭州', '南京', '武汉', '成都', '重庆', '西安'];
const LocationInput = ({ value = '', city = '上海', placeholder = '位置/民宿名/编号', onLocationSelect, onCityChange, onNearbyClick, onChange, loading = false, }) => {
    const [inputValue, setInputValue] = useState(value);
    const [currentCity, setCurrentCity] = useState(city);
    const [isLocating, setIsLocating] = useState(loading);
    const [showCityMenu, setShowCityMenu] = useState(false);
    const [cityMenuStyle, setCityMenuStyle] = useState({});
    const refreshIconRef = useRef(null);
    const selectRef = useRef(null);
    const handleInputChange = (e) => {
        const newValue = e.target.value;
        setInputValue(newValue);
        onChange?.(newValue);
    };
    const handleClear = () => {
        setInputValue('');
        onChange?.('');
    };
    const handleCityClick = () => {
        if (selectRef.current && !showCityMenu) {
            const rect = selectRef.current.getBoundingClientRect();
            setCityMenuStyle({
                position: 'absolute',
                top: `${rect.bottom}px`,
                left: `${rect.left}px`,
                width: `${rect.width}px`,
                zIndex: 1000,
            });
        }
        setShowCityMenu(!showCityMenu);
    };
    const handleCitySelect = (selectedCity) => {
        setCurrentCity(selectedCity);
        onCityChange?.(selectedCity);
        setShowCityMenu(false);
    };
    const handleNearby = async () => {
        setIsLocating(true);
        if (refreshIconRef.current) {
            refreshIconRef.current.style.animation = 'spin 0.6s linear';
        }
        try {
            onNearbyClick?.();
        }
        finally {
            setTimeout(() => {
                setIsLocating(false);
                if (refreshIconRef.current) {
                    refreshIconRef.current.style.animation = 'none';
                }
            }, 600);
        }
    };
    return (_jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.row, children: [_jsxs("div", { ref: selectRef, className: styles.citySelect, onClick: handleCityClick, children: [currentCity, " \u25BC"] }), _jsxs("div", { className: styles.inputWrapper, children: [_jsx("div", { className: styles.prefixIcon, children: "\uD83D\uDCCD" }), _jsx("input", { type: "text", className: styles.input, placeholder: placeholder, value: inputValue, onChange: handleInputChange }), inputValue && (_jsx("div", { className: styles.clearIcon, onClick: handleClear, children: "\u2715" }))] }), _jsxs("div", { ref: refreshIconRef, className: styles.nearbyButton, onClick: handleNearby, title: "\u6211\u7684\u9644\u8FD1", children: ["\uD83D\uDD04", _jsx("span", { className: styles.label, children: "\u9644\u8FD1" })] })] }), showCityMenu && (_jsx("div", { style: cityMenuStyle, className: styles.cityMenu, children: CITIES.map((c) => (_jsx("div", { className: `${styles.cityMenuItem} ${c === currentCity ? styles.active : ''}`, onClick: () => handleCitySelect(c), children: c }, c))) })), _jsx("style", { children: `
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      ` })] }));
};
export default React.memo(LocationInput);
//# sourceMappingURL=index.js.map
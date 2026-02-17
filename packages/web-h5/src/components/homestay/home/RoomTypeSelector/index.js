import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 房间类型选择组件 - Web H5版本
 * 房间数/床位/人数
 */
import React, { useState } from 'react';
import { Popup } from '@nutui/nutui-react';
import styles from './index.module.scss';
const RoomTypeSelector = ({ rooms = 1, beds = 1, guests = 1, onChange, }) => {
    const [tempRooms, setTempRooms] = useState(rooms);
    const [tempBeds, setTempBeds] = useState(beds);
    const [tempGuests, setTempGuests] = useState(guests);
    const [showPicker, setShowPicker] = useState(false);
    const handleConfirm = () => {
        onChange?.(tempRooms, tempBeds, tempGuests);
        setShowPicker(false);
    };
    const handleReset = () => {
        setTempRooms(1);
        setTempBeds(1);
        setTempGuests(1);
    };
    const CounterItem = ({ label, value, min = 1, max = 10, onChange }) => (_jsxs("div", { className: styles.counterItem, children: [_jsx("span", { className: styles.label, children: label }), _jsxs("div", { className: styles.counterControl, children: [_jsx("button", { className: styles.counterBtn, disabled: value <= min, onClick: () => onChange(Math.max(value - 1, min)), children: "\u2212" }), _jsx("span", { className: styles.counterValue, children: value }), _jsx("button", { className: styles.counterBtn, disabled: value >= max, onClick: () => onChange(Math.min(value + 1, max)), children: "+" })] })] }));
    return (_jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.displayBox, onClick: () => setShowPicker(true), children: [_jsx("div", { className: styles.prefixIcon, children: "\uD83D\uDECF\uFE0F" }), _jsxs("div", { className: styles.text, children: [tempRooms, "\u9593 / ", tempBeds, "\u5E8A / ", tempGuests, "\u4EBA"] }), _jsx("div", { className: styles.suffixIcon, children: "\u25BC" })] }), _jsx(Popup, { visible: showPicker, position: "bottom", onClose: () => setShowPicker(false), children: _jsxs("div", { className: styles.pickerContainer, children: [_jsxs("div", { className: styles.pickerHeader, children: [_jsx("button", { className: styles.resetBtn, onClick: handleReset, children: "\u91CD\u7F6E" }), _jsx("h3", { className: styles.title, children: "\u9009\u62E9\u623F\u95F4\u7C7B\u578B" }), _jsx("button", { className: styles.doneBtn, onClick: handleConfirm, children: "\u5B8C\u6210" })] }), _jsxs("div", { className: styles.counterList, children: [_jsx(CounterItem, { label: "\u623F\u95F4\u6570", value: tempRooms, min: 1, max: 10, onChange: setTempRooms }), _jsx(CounterItem, { label: "\u5E8A\u4F4D", value: tempBeds, min: 1, max: 20, onChange: setTempBeds }), _jsx(CounterItem, { label: "\u4EBA\u6570", value: tempGuests, min: 1, max: 20, onChange: setTempGuests })] })] }) })] }));
};
export default React.memo(RoomTypeSelector);
//# sourceMappingURL=index.js.map
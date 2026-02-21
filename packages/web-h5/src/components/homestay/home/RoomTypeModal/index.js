import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 房间类型选择模态框
 * 支持作为独立模态框或作为内容嵌入其他容器
 */
import { useState } from 'react';
import { createPortal } from 'react-dom';
import styles from './index.module.scss';
const RoomTypeModal = ({ visible = true, guests = 1, beds = 0, rooms = 0, onSelect, onClose, usePortal = true, showFooter = false, }) => {
    const [tempGuests, setTempGuests] = useState(guests);
    const [tempBeds, setTempBeds] = useState(beds);
    const [tempRooms, setTempRooms] = useState(rooms);
    const handleConfirm = () => {
        onSelect(tempGuests, tempBeds, tempRooms);
        onClose();
    };
    const handleReset = () => {
        setTempGuests(1);
        setTempBeds(0);
        setTempRooms(0);
    };
    const handleClose = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    const CounterRow = ({ label, value, onChange }) => (_jsxs("div", { className: styles.counterRow, children: [_jsx("span", { className: styles.counterLabel, children: label }), _jsxs("div", { className: styles.counterControl, children: [_jsx("button", { className: styles.minusBtn, onClick: () => onChange(Math.max(value - 1, 0)), children: "\u2212" }), _jsx("span", { className: styles.counterValue, children: value }), _jsx("button", { className: styles.plusBtn, onClick: () => onChange(Math.min(value + 1, 10)), children: "+" })] })] }));
    const content = (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.content, children: [_jsxs("div", { className: styles.section, children: [_jsx("div", { className: styles.sectionLabel, children: "\u603B\u4EBA\u6570" }), _jsx("div", { className: styles.guestOptions, children: [1, 2, 3, 4].map((num) => (_jsxs("button", { className: `${styles.optionBtn} ${tempGuests === num ? styles.active : ''}`, onClick: () => setTempGuests(num), children: [num, "\u4EBA"] }, num))) })] }), _jsx("div", { className: styles.section, children: _jsx(CounterRow, { label: "\u5E8A\u94FA\u6570", value: tempBeds, onChange: setTempBeds }) }), _jsx("div", { className: styles.section, children: _jsx(CounterRow, { label: "\u5C45\u5BA4\u6570", value: tempRooms, onChange: setTempRooms }) })] }), showFooter && (_jsxs("div", { className: styles.footer, children: [_jsx("button", { className: styles.resetBtn, onClick: handleReset, children: "\u6E05\u7A7A" }), _jsx("button", { className: styles.confirmBtn, onClick: handleConfirm, children: "\u786E\u8BA4" })] }))] }));
    // 作为独立模态框使用
    if (usePortal) {
        return createPortal(_jsxs(_Fragment, { children: [visible && _jsx("div", { className: styles.overlay, onClick: handleClose }), _jsxs("div", { className: `${styles.drawer} ${visible ? styles.active : ''}`, children: [_jsxs("div", { className: styles.header, children: [_jsx("button", { className: styles.closeBtn, onClick: onClose, children: "\u2715" }), _jsx("h2", { className: styles.title, children: "\u5165\u4F4F\u6761\u4EF6" }), _jsx("div", { className: styles.placeholder })] }), content] })] }), document.body);
    }
    // 作为内容嵌入使用（不使用 portal）
    return _jsx(_Fragment, { children: content });
};
export default RoomTypeModal;
//# sourceMappingURL=index.js.map
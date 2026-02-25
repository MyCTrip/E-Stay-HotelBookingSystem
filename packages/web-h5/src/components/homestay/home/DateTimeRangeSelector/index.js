import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 日期范围选择组件 - Web H5版本
 */
import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/zh-cn';
import { DatePicker, Popup } from '@nutui/nutui-react';
import styles from './index.module.scss';
dayjs.extend(relativeTime);
dayjs.locale('zh-cn');
const DateTimeRangeSelector = ({ checkIn, checkOut, onDateChange, }) => {
    const [tempCheckIn, setTempCheckIn] = useState(checkIn || dayjs().toDate());
    const [tempCheckOut, setTempCheckOut] = useState(checkOut || dayjs().add(1, 'day').toDate());
    const [showPicker, setShowPicker] = useState(false);
    const [pickerType, setPickerType] = useState('checkIn');
    const nights = dayjs(tempCheckOut).diff(dayjs(tempCheckIn), 'day');
    const formatDateLabel = (date) => {
        const d = dayjs(date);
        const today = dayjs();
        const tomorrow = today.add(1, 'day');
        const dayAfterTomorrow = today.add(2, 'day');
        if (d.format('YYYY-MM-DD') === today.format('YYYY-MM-DD')) {
            return `${d.format('M月D日')} 今天`;
        }
        if (d.format('YYYY-MM-DD') === tomorrow.format('YYYY-MM-DD')) {
            return `${d.format('M月D日')} 明天`;
        }
        if (d.format('YYYY-MM-DD') === dayAfterTomorrow.format('YYYY-MM-DD')) {
            return `${d.format('M月D日')} 后天`;
        }
        return d.format('M月D日');
    };
    const handleDatePick = (date) => {
        const selectedDate = new Date(date);
        if (pickerType === 'checkIn') {
            // 如果选择的入住日期晚于离住日期，自动调整离住日期
            if (selectedDate >= tempCheckOut) {
                const newCheckOut = dayjs(selectedDate).add(1, 'day').toDate();
                setTempCheckIn(selectedDate);
                setTempCheckOut(newCheckOut);
            }
            else {
                setTempCheckIn(selectedDate);
            }
        }
        else {
            // 离住日期必须晚于入住日期
            if (selectedDate <= tempCheckIn) {
                return;
            }
            setTempCheckOut(selectedDate);
        }
        setShowPicker(false);
    };
    const handleConfirm = () => {
        onDateChange?.(tempCheckIn, tempCheckOut);
        setShowPicker(false);
    };
    const handlePickerOpen = (type) => {
        setPickerType(type);
        setShowPicker(true);
    };
    return (_jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.wrapper, children: [_jsxs("div", { className: styles.dateSection, onClick: () => handlePickerOpen('checkIn'), children: [_jsx("div", { className: styles.dateValue, children: formatDateLabel(tempCheckIn) }), _jsx("div", { className: styles.dateLabel, children: "\u5165\u4F4F" })] }), _jsx("div", { className: styles.divider }), _jsxs("div", { className: styles.dateSection, onClick: () => handlePickerOpen('checkOut'), children: [_jsx("div", { className: styles.dateValue, children: formatDateLabel(tempCheckOut) }), _jsx("div", { className: styles.dateLabel, children: "\u79BB\u4F4F" })] }), _jsx("div", { className: styles.rightSection, children: _jsxs("div", { className: styles.nightsInfo, children: [_jsxs("span", { className: styles.nightsLabel, children: ["\u5171", nights, "\u665A"] }), _jsx("span", { className: styles.icon, children: "\uD83D\uDCC5" })] }) })] }), _jsx(Popup, { visible: showPicker, position: "bottom", onClose: () => setShowPicker(false), style: { height: '400px' }, children: _jsxs("div", { className: styles.pickerContainer, children: [_jsx(DatePicker, { value: new Date(pickerType === 'checkIn' ? tempCheckIn : tempCheckOut), startDate: dayjs().toDate(), endDate: dayjs().add(365, 'day').toDate(), type: "date" }), _jsxs("div", { className: styles.pickerFooter, children: [_jsx("button", { className: styles.cancelBtn, onClick: () => setShowPicker(false), children: "\u53D6\u6D88" }), _jsx("button", { className: styles.confirmBtn, onClick: handleConfirm, children: "\u786E\u5B9A" })] })] }) })] }));
};
export default React.memo(DateTimeRangeSelector);
//# sourceMappingURL=index.js.map
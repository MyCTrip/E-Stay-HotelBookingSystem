/**
 * 日期范围日历组件
 * 从网页窗口底部滑入，占 70% 屏幕高度，顶部圆角
 */
import React from 'react';
interface DateRangeCalendarProps {
    visible: boolean;
    checkIn?: Date;
    checkOut?: Date;
    onSelect: (checkIn: Date, checkOut: Date) => void;
    onClose: () => void;
}
declare const DateRangeCalendar: React.FC<DateRangeCalendarProps>;
export default DateRangeCalendar;
//# sourceMappingURL=index.d.ts.map
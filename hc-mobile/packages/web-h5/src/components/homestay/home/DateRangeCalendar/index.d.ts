/**
 * 日期范围日历组件 - 只提供日历内容
 */
import React from 'react';
interface DateRangeCalendarProps {
    checkIn?: Date;
    checkOut?: Date;
    onSelect: (checkIn: Date, checkOut: Date) => void;
    onClose: () => void;
}
declare const DateRangeCalendar: React.FC<DateRangeCalendarProps>;
export default DateRangeCalendar;
//# sourceMappingURL=index.d.ts.map
/**
 * 底部固定预订栏
 * 左侧：房东头像按钮 + 时间选择 | 右侧：预订按钮
 */
import React from 'react';
interface BookingBarProps {
    data?: any;
    checkIn?: string;
    checkOut?: string;
    onBook?: () => void;
    onContactHost?: () => void;
    onDateChange?: (checkIn: string, checkOut: string) => void;
    onSave?: () => void;
    onCancel?: () => void;
    isEditing?: boolean;
}
declare const BookingBar: React.FC<BookingBarProps>;
export default BookingBar;
//# sourceMappingURL=index.d.ts.map
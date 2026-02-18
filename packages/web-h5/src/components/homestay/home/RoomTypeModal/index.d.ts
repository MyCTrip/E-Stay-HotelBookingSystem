/**
 * 房间类型选择模态框
 * 从网页窗口底部滑入，高度自适应
 */
import React from 'react';
interface RoomTypeModalProps {
    visible: boolean;
    guests?: number;
    beds?: number;
    rooms?: number;
    onSelect: (guests: number, beds: number, rooms: number) => void;
    onClose: () => void;
}
declare const RoomTypeModal: React.FC<RoomTypeModalProps>;
export default RoomTypeModal;
//# sourceMappingURL=index.d.ts.map
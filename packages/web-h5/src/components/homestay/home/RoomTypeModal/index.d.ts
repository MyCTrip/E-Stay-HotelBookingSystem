/**
 * 房间类型选择模态框
 * 支持作为独立模态框或作为内容嵌入其他容器
 */
import React from 'react';
interface RoomTypeModalProps {
    visible?: boolean;
    guests?: number;
    beds?: number;
    rooms?: number;
    onSelect: (guests: number, beds: number, rooms: number) => void;
    onClose: () => void;
    usePortal?: boolean;
    showFooter?: boolean;
}
declare const RoomTypeModal: React.FC<RoomTypeModalProps>;
export default RoomTypeModal;
//# sourceMappingURL=index.d.ts.map
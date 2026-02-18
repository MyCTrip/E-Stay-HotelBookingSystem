import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * 房间类型选择组件 - Web H5版本
 * 房间数/床位/人数
 */
import React, { useState } from 'react';
import RoomTypeModal from '../RoomTypeModal';
import styles from './index.module.scss';
const RoomTypeSelector = ({ rooms = 0, beds = 0, guests = 1, onChange, }) => {
    const [tempGuests, setTempGuests] = useState(guests);
    const [tempBeds, setTempBeds] = useState(beds);
    const [tempRooms, setTempRooms] = useState(rooms);
    const [showModal, setShowModal] = useState(false);
    const handleSelect = (newGuests, newBeds, newRooms) => {
        setTempGuests(newGuests);
        setTempBeds(newBeds);
        setTempRooms(newRooms);
        onChange?.(newGuests, newBeds, newRooms);
    };
    return (_jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.displayBox, onClick: () => setShowModal(true), children: [_jsxs("div", { className: styles.text, children: [tempGuests, "\u4EBA / ", tempBeds, "\u5E8A / ", tempRooms, "\u95F4"] }), _jsx("div", { className: styles.suffixIcon, children: _jsx("svg", { viewBox: "0 0 24 24", width: "16", height: "16", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2.5, d: "M6 9l6 6 6-6" }) }) })] }), _jsx(RoomTypeModal, { visible: showModal, guests: tempGuests, beds: tempBeds, rooms: tempRooms, onSelect: handleSelect, onClose: () => setShowModal(false) })] }));
};
export default React.memo(RoomTypeSelector);
//# sourceMappingURL=index.js.map
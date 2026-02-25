import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import styles from './index.module.scss';
const SearchResultHeader = ({ filters, onModifyClick }) => {
    const navigate = useNavigate();
    const formatCondition = () => {
        const checkIn = filters.checkInDate ? dayjs(filters.checkInDate).format('M.DD') : '';
        const checkOut = filters.checkOutDate ? dayjs(filters.checkOutDate).format('M.DD') : '';
        const roomsText = filters.roomCount ? `${filters.roomCount}间` : '';
        const guestsText = filters.guestCount ? `${filters.guestCount}人` : '';
        return `${filters.city || '城市'} | ${checkIn}-${checkOut}・${roomsText}${guestsText}`;
    };
    return (_jsx("div", { className: styles.headerWrapper, children: _jsxs("div", { className: styles.header, children: [_jsx("button", { className: styles.backBtn, onClick: () => navigate(-1), title: "\u8FD4\u56DE", children: "\u2039" }), _jsx("div", { className: styles.conditionArea, onClick: onModifyClick, children: _jsx("div", { className: styles.conditionText, children: formatCondition() }) }), _jsx("button", { className: styles.modifyBtn, onClick: onModifyClick, title: "\u4FEE\u6539\u641C\u7D22\u6761\u4EF6", children: "\uD83D\uDD0D" })] }) }));
};
export default SearchResultHeader;
//# sourceMappingURL=index.js.map
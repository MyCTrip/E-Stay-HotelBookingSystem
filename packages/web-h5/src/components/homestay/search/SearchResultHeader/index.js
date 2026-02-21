import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
const SearchResultHeader = ({ city = '城市' }) => {
    const navigate = useNavigate();
    return (_jsx("div", { className: styles.headerWrapper, children: _jsxs("div", { className: styles.header, children: [_jsx("button", { className: styles.backBtn, onClick: () => navigate(-1), title: "\u8FD4\u56DE", children: _jsx("svg", { viewBox: "0 0 24 24", width: "24", height: "24", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) }), _jsxs("h1", { className: styles.title, children: [city, "\u6C11\u5BBF"] }), _jsx("div", { className: styles.placeholder })] }) }));
};
export default SearchResultHeader;
//# sourceMappingURL=index.js.map
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { createPortal } from 'react-dom';
import styles from './index.module.scss';
const BottomDrawer = ({ visible, title, maxHeight = '70vh', onClose, showBackButton = true, showHeader = true, children, }) => {
    const drawerStyle = {
        maxHeight: typeof maxHeight === 'number' ? `${maxHeight}px` : maxHeight,
    };
    return createPortal(_jsxs(_Fragment, { children: [visible && _jsx("div", { className: styles.overlay, onClick: onClose }), _jsxs("div", { className: `${styles.drawer} ${visible ? styles.active : ''}`, style: drawerStyle, children: [showHeader && (_jsxs("div", { className: styles.header, children: [showBackButton && (_jsx("button", { className: styles.backBtn, onClick: onClose, children: _jsx("svg", { viewBox: "0 0 24 24", width: "24", height: "24", fill: "none", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 19l-7-7 7-7" }) }) })), _jsx("h2", { className: styles.title, children: title || '' }), _jsx("div", { className: styles.placeholder })] })), _jsx("div", { className: styles.content, children: children })] })] }), document.body);
};
export default BottomDrawer;
//# sourceMappingURL=index.js.map
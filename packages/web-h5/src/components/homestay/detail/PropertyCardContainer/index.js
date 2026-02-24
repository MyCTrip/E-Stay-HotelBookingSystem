import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 房源卡片容器 - 提供卡片样式、标签、展开按钮、Header 区域
 */
import { useState } from 'react';
import styles from './index.module.scss';
import UpArrowIcon from '../../../icons/UpArrowIcon';
import DownArrowIcon from '../../../icons/DownArrowIcon';
import { TipIcon } from '../../icons';
const PropertyCardContainer = ({ children, headerConfig, showLabel = false, labelText = '', tooltipText = '', showExpandBtn = false, expandBtnText = '', isExpanded = false, onExpandToggle, }) => {
    const [showTooltip, setShowTooltip] = useState(false);
    return (_jsx("div", { className: styles.container, children: _jsxs("div", { className: styles.card, children: [headerConfig?.show && (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.header, children: [headerConfig?.title?.show && headerConfig?.title?.text && (_jsx("h2", { className: styles.headerTitle, children: headerConfig.title.text })), headerConfig?.textButton?.show && headerConfig?.textButton?.text && (_jsxs("button", { className: styles.headerTextBtn, onClick: headerConfig.textButton.onClick, children: [headerConfig.textButton.text, _jsx("span", { className: styles.headerArrow, children: "\u203A" })] }))] }), headerConfig?.tipTag?.show && (_jsxs("div", { className: styles.tipTag, children: [_jsx(headerConfig.tipTag.icon, { width: 12, height: 12 }), _jsx("span", { className: styles.tipTagText, children: headerConfig.tipTag.text })] }))] })), showLabel && labelText && (_jsxs("div", { className: styles.labelTag, children: [_jsx("span", { children: labelText }), tooltipText && (_jsxs("div", { className: styles.tipWrapper, children: [_jsx("button", { className: styles.tipBtn, onClick: () => setShowTooltip(!showTooltip), title: "\u67E5\u770B\u63D0\u793A", children: _jsx(TipIcon, { width: 14, height: 14, color: "#fff" }) }), showTooltip && (_jsxs("div", { className: styles.tooltip, children: [_jsx("div", { className: styles.tooltipContent, children: tooltipText }), _jsx("div", { className: styles.tooltipArrow })] }))] }))] })), _jsx("div", { className: `${styles.content} ${showLabel && labelText ? styles.withLabel : ''}`, children: children }), showExpandBtn && expandBtnText && (_jsxs("button", { className: `${styles.expandBtn} ${isExpanded ? styles.expanded : ''}`, onClick: onExpandToggle, children: [_jsx("span", { className: styles.btnText, children: expandBtnText }), _jsx("span", { className: styles.icon, children: isExpanded ? (_jsx(UpArrowIcon, { width: 10, height: 10, color: "#999" })) : (_jsx(DownArrowIcon, { width: 10, height: 10, color: "#999" })) })] }))] }) }));
};
export default PropertyCardContainer;
//# sourceMappingURL=index.js.map
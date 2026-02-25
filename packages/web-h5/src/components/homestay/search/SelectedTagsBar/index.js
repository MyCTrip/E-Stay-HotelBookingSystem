import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './index.module.scss';
const SelectedTagsBar = ({ tags, onTagRemove, onResetAll }) => {
    if (tags.length === 0)
        return null;
    return (_jsx("div", { className: styles.tagsWrapper, children: _jsxs("div", { className: styles.tagsList, children: [tags.map(tag => (_jsxs("div", { className: styles.tag, children: [_jsx("span", { children: tag.label }), _jsx("button", { className: styles.removeBtn, onClick: () => onTagRemove(tag.key), title: "\u5220\u9664", children: "\u00D7" })] }, tag.key))), _jsx("button", { className: styles.resetBtn, onClick: onResetAll, children: "\u91CD\u7F6E" })] }) }));
};
export default SelectedTagsBar;
//# sourceMappingURL=index.js.map
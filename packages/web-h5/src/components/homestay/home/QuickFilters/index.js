import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 快捷筛选标签组件 - Web H5版本
 */
import React, { useState } from 'react';
import { QUICK_FILTER_TAGS } from '@estay/shared';
import styles from './index.module.scss';
const QuickFilters = ({ tags = QUICK_FILTER_TAGS, selectedTags = [], onTagSelect, maxSelect, }) => {
    const [selected, setSelected] = useState(new Set(selectedTags));
    const handleTagClick = (tagId) => {
        const newSelected = new Set(selected);
        const isCurrentlySelected = newSelected.has(tagId);
        // 如果已选且达到最大数量，不允许添加
        if (!isCurrentlySelected && maxSelect && newSelected.size >= maxSelect) {
            return;
        }
        if (isCurrentlySelected) {
            newSelected.delete(tagId);
        }
        else {
            newSelected.add(tagId);
        }
        setSelected(newSelected);
        onTagSelect?.(tagId, !isCurrentlySelected);
    };
    return (_jsx("div", { className: styles.container, children: _jsx("div", { className: styles.scrollWrapper, children: tags.map((tag) => {
                const isSelected = selected.has(tag.id);
                return (_jsxs("div", { className: `${styles.tag} ${isSelected ? styles.selected : ''}`, onClick: () => handleTagClick(tag.id), children: [tag.badge && _jsx("span", { className: styles.badge, children: tag.badge }), _jsx("span", { className: styles.label, children: tag.label })] }, tag.id));
            }) }) }));
};
export default React.memo(QuickFilters);
//# sourceMappingURL=index.js.map
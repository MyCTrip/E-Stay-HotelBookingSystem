import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
/**
 * 搜索按钮组件 - Web H5版本
 */
import React, { useState } from 'react';
import styles from './index.module.scss';
const SearchButton = ({ loading = false, disabled = false, onClick, label = '查询', }) => {
    const [isLoading, setIsLoading] = useState(loading);
    const handleClick = async () => {
        if (disabled || isLoading)
            return {};
        setIsLoading(true);
        try {
            const result = onClick?.();
            if (result instanceof Promise) {
                await result;
            }
        }
        catch (error) {
            console.error('Search button error:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    return (_jsx("div", { className: styles.container, children: _jsx("button", { className: `${styles.button} ${isLoading || disabled ? styles.disabled : ''}`, onClick: handleClick, disabled: disabled || isLoading, children: isLoading ? (_jsx("div", { className: styles.loadingContent, children: _jsxs("span", { children: ["\u23F3 ", label] }) })) : (_jsx("span", { children: label })) }) }));
};
export default React.memo(SearchButton);
//# sourceMappingURL=index.js.map
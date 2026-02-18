import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 推荐类型卡片组件
 * 上文字（title + subtitle）下圆形图标
 */
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './index.module.scss';
const RecommendTypeCard = ({ title, subtitle, icon, backgroundGradient, searchParams = {}, onClick, }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        if (onClick) {
            onClick();
        }
        else if (searchParams && Object.keys(searchParams).length > 0) {
            // 构建查询参数并跳转到搜索结果页
            const queryParams = new URLSearchParams();
            Object.entries(searchParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    queryParams.append(key, String(value));
                }
            });
            navigate(`/search/homeStay?${queryParams.toString()}`);
        }
    };
    // 处理渐变色配置
    const getBackgroundStyle = () => {
        if (typeof backgroundGradient === 'string') {
            return { background: backgroundGradient };
        }
        return {
            background: `linear-gradient(135deg, ${backgroundGradient.from} 0%, ${backgroundGradient.to} 100%)`,
        };
    };
    return (_jsxs("div", { className: styles.card, style: getBackgroundStyle(), onClick: handleClick, children: [_jsxs("div", { className: styles.textSection, children: [_jsx("h3", { className: styles.title, children: title }), _jsx("p", { className: styles.subtitle, children: subtitle })] }), _jsx("div", { className: styles.iconContainer, children: icon })] }));
};
export default React.memo(RecommendTypeCard);
//# sourceMappingURL=index.js.map
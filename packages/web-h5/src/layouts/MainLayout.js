import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import styles from './MainLayout.module.css';
import { useState, useEffect } from 'react';
/**
 * 主布局组件
 */
export default function MainLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeCategory, setActiveCategory] = useState('domestic');
    const categories = [
        { id: 'domestic', label: '国内', icon: '🇨🇳' },
        { id: 'hourly', label: '钟点房', icon: '⏰' },
        { id: 'homestay', label: '民宿', icon: '🏡' },
    ];
    useEffect(() => {
        // 根据当前路径设置 activeCategory
        if (location.pathname.startsWith('/hourlyHotel') ||
            location.pathname.includes('/hourlyHotel')) {
            setActiveCategory('hourly');
        }
        else if (location.pathname.startsWith('/homeStay') ||
            location.pathname.includes('/homeStay')) {
            setActiveCategory('homestay');
        }
        else {
            setActiveCategory('domestic');
        }
    }, [location.pathname]);
    return (_jsxs("div", { className: styles.container, children: [_jsx("header", { className: styles.header, children: _jsxs("div", { className: styles.headerContent, children: [_jsx(Link, { to: "/", className: styles.logo, children: "\uD83C\uDFE8 E-Stay" }), _jsx("nav", { className: styles.nav, children: categories.map((cat) => (_jsxs("button", { className: `${styles.navItem} ${activeCategory === cat.id ? styles.active : ''}`, onClick: () => {
                                    setActiveCategory(cat.id);
                                    if (cat.id === 'domestic')
                                        navigate('/hotel');
                                    if (cat.id === 'hourly')
                                        navigate('/hourlyHotel');
                                    if (cat.id === 'homestay')
                                        navigate('/homeStay');
                                }, children: [_jsx("span", { className: styles.icon, children: cat.icon }), cat.label] }, cat.id))) })] }) }), _jsx("main", { className: styles.main, children: children || _jsx(Outlet, {}) }), _jsx("nav", { className: styles.mobileNav, children: categories.map((cat) => (_jsxs("button", { className: `${styles.mobileNavItem} ${activeCategory === cat.id ? styles.active : ''}`, onClick: () => {
                        setActiveCategory(cat.id);
                        if (cat.id === 'domestic')
                            navigate('/hotel');
                        if (cat.id === 'hourly')
                            navigate('/hourlyHotel');
                        if (cat.id === 'homestay')
                            navigate('/homeStay');
                    }, title: cat.label, children: [_jsx("span", { className: styles.mobileNavIcon, children: cat.icon }), _jsx("span", { className: styles.mobileNavLabel, children: cat.label })] }, cat.id))) })] }));
}
//# sourceMappingURL=MainLayout.js.map
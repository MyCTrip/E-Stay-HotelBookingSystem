import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 热门民宿推荐区组件 - Web H5版本
 */
import React, { useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import HomeStayCard from '../HomeStayCard';
import styles from './index.module.scss';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
const HotStaysSection = ({ title = '推荐', data = [], onCardClick, loading = false, }) => {
    const swiperRef = useRef(null);
    if (!data || data.length === 0) {
        return null;
    }
    return (_jsxs("div", { className: styles.container, children: [_jsxs("div", { className: styles.header, children: [_jsx("h3", { className: styles.title, children: title }), _jsx("a", { href: "#all", className: styles.viewAll, children: "\u5168\u90E8 >" })] }), loading ? (_jsxs("div", { className: styles.loadingContainer, children: [_jsx("div", { className: styles.skeleton }), _jsx("div", { className: styles.skeleton })] })) : (_jsx("div", { className: styles.swiperWrapper, children: _jsx(Swiper, { ref: swiperRef, modules: [Navigation, Pagination, Autoplay], slidesPerView: 'auto', spaceBetween: 12, centeredSlidesBounds: true, autoplay: {
                        delay: 3000,
                        disableOnInteraction: true,
                    }, grabCursor: true, className: styles.swiper, children: data.map((homestay) => (_jsx(SwiperSlide, { className: styles.slide, children: _jsx(HomeStayCard, { data: homestay, onClick: onCardClick }) }, homestay._id))) }) }))] }));
};
export default React.memo(HotStaysSection);
//# sourceMappingURL=index.js.map
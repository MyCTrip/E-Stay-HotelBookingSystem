import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PropertyCardContainer from '../PropertyCardContainer';
import styles from './index.module.scss';
/**
 * ReviewSection 内容组件
 */
const ReviewSectionContent = ({ hostelId, reviews: middlewareReviews }) => {
    // 使用中间件数据，如果没有则使用mock数据
    const reviews = middlewareReviews && middlewareReviews.length > 0 ? middlewareReviews : [
        {
            id: '1',
            author: '李女士',
            rating: 5,
            date: '2024-02-10',
            content: '房间很宽敞，设施完整，位置很好，离地铁很近。房东也很热心。',
            images: [],
        },
        {
            id: '2',
            author: '王先生',
            rating: 4,
            date: '2024-02-08',
            content: '整体不错，就是隔音效果一般。',
            images: [],
        },
    ];
    return (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.scoreOverview, children: [_jsxs("div", { className: styles.scoreMain, children: [_jsx("div", { className: styles.number, children: "4.9" }), _jsx("div", { className: styles.stars, children: "\u2B50\u2B50\u2B50\u2B50\u2B50" }), _jsx("div", { className: styles.count, children: "90\u6761\u8BC4\u4EF7" })] }), _jsx("div", { className: styles.scoreDistribution, children: [5, 4, 3, 2, 1].map((score) => (_jsxs("div", { className: styles.scoreRow, children: [_jsxs("span", { className: styles.label, children: [score, "\u5206"] }), _jsx("div", { className: styles.bar, children: _jsx("div", { className: styles.fill, style: { width: `${(1 + score) * 20}%` } }) }), _jsx("span", { className: styles.count, children: (1 + score) * 15 })] }, score))) })] }), _jsx("div", { className: styles.tags, children: ['位置方便', '设施完整', '干净舒适', '房东热心', '性价比高'].map((tag) => (_jsx("button", { className: styles.tag, children: tag }, tag))) }), _jsx("div", { className: styles.reviewList, children: reviews.map((review) => (_jsxs("div", { className: styles.reviewItem, children: [_jsxs("div", { className: styles.header, children: [_jsxs("div", { children: [_jsx("div", { className: styles.author, children: review.author }), _jsxs("div", { className: styles.rating, children: ["\u2B50 ", review.rating] })] }), _jsx("div", { className: styles.date, children: review.date })] }), _jsx("p", { className: styles.content, children: review.content })] }, review.id))) }), _jsx("button", { className: styles.viewAll, children: "\u67E5\u770B\u5168\u90E890\u6761\u8BC4\u4EF7" })] }));
};
const ReviewSection = ({ hostelId }) => {
    return (_jsx(PropertyCardContainer, { headerConfig: {
            show: true,
            title: {
                text: '用户评价',
                show: true,
            },
        }, children: _jsx(ReviewSectionContent, { hostelId: hostelId }) }));
};
export default ReviewSection;
//# sourceMappingURL=index.js.map
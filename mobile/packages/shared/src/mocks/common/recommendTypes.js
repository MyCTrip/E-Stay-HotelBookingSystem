/**
 * 推荐分类 Mock 数据
 * 完全对应 web-h5/src/components/homestay/home/RecommendTypes/index.tsx 中的定义
 */
export const RECOMMEND_TYPES = [
    {
        id: 'quality-houses',
        title: '品质好房',
        subtitle: '平台甄选 入住无忧',
        backgroundGradient: {
            from: '#FFE4E1',
            to: '#FFC0CB',
        },
        searchParams: {
            city: '上海',
            tag: 'quality',
        },
    },
    {
        id: 'pet-friendly',
        title: '携宠出游',
        subtitle: '带毛孩子撒欢',
        backgroundGradient: {
            from: '#FFF8DC',
            to: '#FFE4B5',
        },
        searchParams: {
            city: '上海',
            tag: 'pet-friendly',
        },
    },
    {
        id: 'weekend-deals',
        title: '周末不加价',
        subtitle: '订民宿折上折',
        backgroundGradient: {
            from: '#E0FFE0',
            to: '#C0FFC0',
        },
        searchParams: {
            city: '上海',
            tag: 'weekend-deals',
        },
    },
];
//# sourceMappingURL=recommendTypes.js.map
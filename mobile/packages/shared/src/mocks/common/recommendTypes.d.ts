/**
 * 推荐分类 Mock 数据
 * 完全对应 web-h5/src/components/homestay/home/RecommendTypes/index.tsx 中的定义
 */
export interface RecommendTypeCardProps {
    id: string;
    title: string;
    subtitle: string;
    icon?: React.ReactNode;
    backgroundGradient?: {
        from: string;
        to: string;
    };
    searchParams?: {
        city: string;
        tag: string;
    };
}
export declare const RECOMMEND_TYPES: RecommendTypeCardProps[];
//# sourceMappingURL=recommendTypes.d.ts.map
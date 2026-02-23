/**
 * 推荐类型卡片组件
 * 上文字（title + subtitle）下圆形图标
 */
import React from 'react';
export interface RecommendTypeCardProps {
    id: string;
    title: string;
    subtitle: string;
    icon: React.ReactNode;
    backgroundGradient: string | {
        from: string;
        to: string;
    };
    searchParams?: {
        city?: string;
        tag?: string;
        [key: string]: string | undefined;
    };
    onClick?: () => void;
}
declare const _default: React.NamedExoticComponent<RecommendTypeCardProps>;
export default _default;
//# sourceMappingURL=index.d.ts.map
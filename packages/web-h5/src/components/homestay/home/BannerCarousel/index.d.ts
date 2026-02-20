interface BannerItem {
    id: string;
    title: string;
    subtitle?: string;
    link?: string;
    color?: string;
}
interface BannerCarouselProps {
    items?: BannerItem[];
    autoPlay?: boolean;
    interval?: number;
    onBannerClick?: (item: BannerItem) => void;
}
/**
 * 民宿首页轮播组件
 * 遵循规范：
 * - 宽度100%，高度480px
 * - 圆角10-12pt
 * - 自动轮播3.5秒，支持手动滑动
 * - 底部indicator显示当前位置
 * - 淡出淡入切换效果
 * - 纯色填充覆盖整个区域
 */
export default function BannerCarousel({ items, autoPlay, interval, onBannerClick, }: BannerCarouselProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map
interface BannerItem {
    id: string;
    image: string;
    title: string;
    subtitle?: string;
    link?: string;
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
 * - 宽度100%，高度200-240px
 * - 圆角10-12pt
 * - 自动轮播3.5秒，支持手动滑动
 * - 底部indicator显示当前位置
 * - 图片覆盖层渐变效果
 */
export default function BannerCarousel({ items, autoPlay, interval, onBannerClick, }: BannerCarouselProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map
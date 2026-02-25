import { HomeStay } from '@estay/shared';
interface RecommendCardProps {
    homestay: HomeStay;
    onClick?: (homestay: HomeStay) => void;
}
/**
 * 民宿推荐卡片组件
 * 左图右文布局，显示民宿基本信息
 * 遵循规范：
 * - 卡片圆角8-12pt，内边距8-12pt
 * - 图片1:1比例，左侧100x100pt
 * - 评分、标签、价格显示
 * - 点击热区≥44*44pt
 */
export default function RecommendCard({ homestay, onClick, }: RecommendCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map
interface NavItem {
    id: string;
    icon: string;
    label: string;
    action?: () => void;
}
interface QuickNavProps {
    items?: NavItem[];
}
/**
 * 民宿首页快速导航组件（金刚区）
 * 2x4网格布局，8个快速入口
 * 遵循规范：
 * - 每个item ≥44*44pt 点击区域
 * - icon 48pt，底部12pt文字
 * - 左右边距16pt, 行间距10-12pt
 * - 圆角8-12pt，图标背景渐变
 */
export default function QuickNav({ items }: QuickNavProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=index.d.ts.map
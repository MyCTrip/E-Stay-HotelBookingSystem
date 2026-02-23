import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './index.module.scss';
const RoomFeatures = ({ data }) => {
    const features = [
        {
            title: '4K高清摄影',
            subtitle: '房间视听',
            icon: '📷',
            description: '1、交通便捷：步行到10分钟内某处下车入口广场\n2、房间内高端设施和视听设备\n3、商业汇集：主要卖场、百货等\n4、东方明珠、浦东跨江大桥等可直观看到',
            image: 'https://picsum.photos/300/200?random=feature1',
        },
        {
            title: '游戏娱乐室',
            subtitle: '家庭活动',
            icon: '🎮',
            description: '宽敞的游戏娱乐室，配备最新游戏设备',
            image: 'https://picsum.photos/300/200?random=feature2',
        },
    ];
    return (_jsxs("div", { className: styles.roomFeatures, children: [_jsx("div", { className: styles.header, children: _jsx("h2", { className: styles.title, children: "\u623F\u5C4B\u7279\u8272" }) }), _jsx("div", { className: styles.featuresList, children: features.map((feature, idx) => (_jsxs("div", { className: styles.featureCard, children: [_jsxs("div", { className: styles.featureHeader, children: [_jsx("span", { className: styles.icon, children: feature.icon }), _jsxs("div", { className: styles.titleSection, children: [_jsx("h3", { className: styles.featureTitle, children: feature.title }), _jsx("p", { className: styles.subtitle, children: feature.subtitle })] })] }), _jsx("p", { className: styles.description, children: feature.description }), feature.image && (_jsx("div", { className: styles.imageContainer, children: _jsx("img", { src: feature.image, alt: feature.title, className: styles.image }) }))] }, idx))) }), _jsx("button", { className: styles.viewMoreBtn, children: "\u5C55\u5F00\u67E5\u770B\u5168\u90E8\u623F\u95F4" })] }));
};
export default RoomFeatures;
//# sourceMappingURL=index.js.map
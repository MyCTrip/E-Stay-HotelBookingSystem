import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * 位置周边区域
 * 展示地址、地图和周边景点交通
 */
import { useState } from 'react';
import PropertyCardContainer from '../PropertyCardContainer';
import styles from './index.module.scss';
import { PositionIcon, TipIcon } from '../../icons';
/**
 * NearbyRecommendations 内容组件
 */
const NearbyRecommendationsContent = ({ surroundings: middlewareSurroundings, baseInfo: middlewareBaseInfo, }) => {
    const [activeTab, setActiveTab] = useState('transport');
    const [showCopyToast, setShowCopyToast] = useState(false);
    const locationData = {
        fullAddress: middlewareBaseInfo?.fullAddress,
        detailAddress: middlewareBaseInfo?.fullAddress ? (middlewareBaseInfo.fullAddress.substring(0, 30) + '...') : '',
        community: middlewareBaseInfo?.community,
        belongsTo: middlewareBaseInfo?.community?.belongTo,
        buildAge: middlewareBaseInfo?.community?.buildAge,
        buildType: middlewareBaseInfo?.community?.buildType,
    };
    // 安全处理 surroundings 数组
    const surroundingsArray = Array.isArray(middlewareSurroundings) ? middlewareSurroundings : [];
    const transportations = surroundingsArray.find((item) => item.type === 'transportations')?.content || [];
    const attractions = surroundingsArray.find((item) => item.type === 'attractions')?.content || [];
    const restaurants = surroundingsArray.find((item) => item.type === 'restaurants')?.content || [];
    const shopping = surroundingsArray.find((item) => item.type === 'shopping')?.content || [];
    const handleCopyAddress = () => {
        navigator.clipboard.writeText(locationData.fullAddress).then(() => {
            setShowCopyToast(true);
            setTimeout(() => {
                setShowCopyToast(false);
            }, 2400);
        });
    };
    const getTabData = () => {
        switch (activeTab) {
            case 'transport':
                return transportations;
            case 'attraction':
                return attractions;
            case 'food':
                return restaurants;
            case 'shopping':
                return shopping;
            default:
                return [];
        }
    };
    return (_jsxs("div", { className: styles.section, children: [_jsxs("div", { className: styles.addressBlock, children: [_jsxs("div", { className: styles.addressItem, children: [_jsx("span", { className: styles.label, children: "\u5B8C\u6574\u5730\u5740" }), _jsxs("div", { className: styles.addressWithCopy, children: [_jsxs("span", { className: styles.address, children: [_jsx(PositionIcon, { width: 14, height: 14, color: "#8da5cd" }), locationData.fullAddress] }), _jsx("button", { className: styles.copyBtn, onClick: handleCopyAddress, children: "\u590D\u5236" })] })] }), _jsxs("div", { className: styles.detailCard, children: [_jsx("h4", { className: styles.cardTitle, children: "\u623F\u6E90\u6240\u5728\u5C0F\u533A" }), _jsxs("div", { className: styles.detailsGrid, children: [_jsxs("div", { className: styles.detailItem, children: [_jsx("span", { className: styles.label, children: "\u5C0F\u533A\u540D\u79F0:" }), _jsx("span", { className: styles.value, children: locationData.community?.name || '-' })] }), _jsxs("div", { className: styles.detailItem, children: [_jsx("span", { className: styles.label, children: "\u6240\u5C5E\u5546\u5708:" }), _jsx("span", { className: styles.value, children: locationData.belongsTo || '-' })] }), _jsxs("div", { className: styles.detailItem, children: [_jsx("span", { className: styles.label, children: "\u5EFA\u7B51\u5E74\u4EE3:" }), _jsx("span", { className: styles.value, children: locationData.buildAge || '-' })] }), _jsxs("div", { className: styles.detailItem, children: [_jsx("span", { className: styles.label, children: "\u5C0F\u533A\u7C7B\u578B:" }), _jsx("span", { className: styles.value, children: locationData.buildType || '-' })] })] })] })] }), _jsxs("div", { className: styles.tabSection, children: [_jsxs("div", { className: styles.tabButtons, children: [_jsx("button", { className: `${styles.tabBtn} ${activeTab === 'transport' ? styles.active : ''}`, onClick: () => setActiveTab('transport'), children: "\u4EA4\u901A" }), _jsx("button", { className: `${styles.tabBtn} ${activeTab === 'attraction' ? styles.active : ''}`, onClick: () => setActiveTab('attraction'), children: "\u666F\u70B9" }), _jsx("button", { className: `${styles.tabBtn} ${activeTab === 'food' ? styles.active : ''}`, onClick: () => setActiveTab('food'), children: "\u7F8E\u98DF" }), _jsx("button", { className: `${styles.tabBtn} ${activeTab === 'shopping' ? styles.active : ''}`, onClick: () => setActiveTab('shopping'), children: "\u8D2D\u7269" })] }), _jsx("div", { className: styles.tabContent, children: getTabData().map((item, idx) => {
                            // 安全检查：确保 item 和必要字段存在
                            if (!item || !item.name)
                                return null;
                            const distance = item.distance || { value: '?', unit: '' };
                            return (_jsxs("div", { className: styles.contentItem, children: [_jsx("span", { className: styles.itemName, children: item.name }), _jsxs("span", { className: styles.itemDistance, children: ["\u76F4\u7EBF\u8DDD\u79BB ", distance.value, distance.unit] })] }, idx));
                        }) })] }), _jsxs("div", { className: styles.tipSection, children: [_jsx(TipIcon, { width: 14, height: 14, color: '#999' }), _jsx("span", { className: styles.tipText, children: "\u6570\u636E\u4EC5\u4F9B\u53C2\u8003\uFF0C\u5177\u4F53\u4EE5\u5B9E\u9645\u60C5\u51B5\u4E3A\u51C6" })] }), showCopyToast && (_jsx("div", { className: styles.copyToast, children: "\u590D\u5236\u6210\u529F" }))] }));
};
const NearbyRecommendations = ({ surroundings, baseInfo, }) => {
    const handleViewMap = () => {
        // 处理地图/周边点击
        console.log('打开地图');
    };
    return (_jsx(PropertyCardContainer, { headerConfig: {
            show: true,
            title: {
                text: '位置周边',
                show: true,
            },
            textButton: {
                text: '更多周边信息',
                show: true,
                onClick: handleViewMap,
            },
        }, children: _jsx(NearbyRecommendationsContent, { surroundings: surroundings, baseInfo: baseInfo }) }));
};
export default NearbyRecommendations;
//# sourceMappingURL=index.js.map
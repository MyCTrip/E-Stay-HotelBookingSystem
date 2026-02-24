import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './index.module.scss';
const RoomPackageDetail = ({ room, selectedPackageId }) => {
    // 从 room.packageDetails 中获取选中的套餐详情
    // 如果没有 selectedPackageId，则获取第一个有 showPackageDetail=true 的套餐
    const packageDetails = room?.packageDetails;
    let packageData = packageDetails?.[selectedPackageId || 1];
    // 如果没有找到，尝试获取第一个存在的套餐详情
    if (!packageData && packageDetails) {
        const firstKey = Object.keys(packageDetails)[0];
        packageData = packageDetails[Number(firstKey)];
    }
    // 如果还是没有数据，使用默认数据
    if (!packageData) {
        packageData = {
            title: '暂无套餐详情',
            checkInService: '',
            enjoyService: '',
            details: [],
        };
    }
    return (_jsxs("div", { className: styles.packageDetail, children: [_jsx("div", { className: styles.packageTitle, children: packageData.title }), packageData.checkInService && (_jsxs("div", { className: styles.serviceCard, children: [_jsxs("div", { className: styles.serviceHeader, children: [_jsx("span", { className: styles.tag, children: "\u4F4F" }), _jsx("span", { className: styles.serviceLabel, children: "\u5165\u4F4F\u670D\u52A1\u4FE1\u606F" })] }), _jsx("div", { className: styles.serviceContent, children: packageData.checkInService })] })), packageData.enjoyService && (_jsxs("div", { className: styles.serviceCard, children: [_jsxs("div", { className: styles.serviceHeader, children: [_jsx("span", { className: styles.tag, children: "\u4EAB" }), _jsx("span", { className: styles.serviceLabel, children: "\u4EAB\u53D7\u670D\u52A1\u4FE1\u606F" })] }), _jsx("div", { className: styles.serviceContent, children: packageData.enjoyService })] })), _jsx("div", { className: styles.infoTable, children: packageData.details && packageData.details.map((item, index) => (_jsxs("div", { className: styles.tableRow, children: [_jsx("div", { className: styles.tableCell, children: _jsx("span", { className: styles.cellLabel, children: item.lable || item.label }) }), _jsx("div", { className: styles.tableCell, children: _jsx("span", { className: styles.cellValue, children: item.value }) })] }, index))) }), _jsx("div", { className: styles.spacer })] }));
};
export default RoomPackageDetail;
//# sourceMappingURL=index.js.map
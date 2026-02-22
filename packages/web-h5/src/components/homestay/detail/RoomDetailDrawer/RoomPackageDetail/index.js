import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import styles from './index.module.scss';
const RoomPackageDetail = ({ room }) => {
    const packageData = {
        title: '上海迪士尼乐园专车接送服务 1份',
        checkInService: '酒店接待及入住协助，专业行李员服务',
        enjoyService: '免费WiFi、行政酒廊使用权、每日早餐券',
        details: [
            {
                label: '使用人数',
                value: '每份选用4名成人，2名儿童，身高1.3米(含)以上，或者年年龄6周岁(含)以上儿童计入成人数'
            },
            {
                label: '预约规则',
                value: '需提前1天预约'
            },
            {
                label: '联系电话',
                value: '+86-13482031211'
            },
            {
                label: '接待时间',
                value: '06:00-09:00,20:30-23:00'
            },
            {
                label: '规则说明',
                value: '请提前联系本酒店预约的时间'
            }
        ]
    };
    return (_jsxs("div", { className: styles.packageDetail, children: [_jsx("div", { className: styles.packageTitle, children: packageData.title }), _jsx("div", { className: styles.serviceCard, children: _jsxs("div", { className: styles.serviceHeader, children: [_jsx("span", { className: styles.tag, children: "\u4F4F" }), _jsx("span", { className: styles.serviceLabel, children: "\u5165\u4F4F\u670D\u52A1\u4FE1\u606F" })] }) }), _jsx("div", { className: styles.serviceCard, children: _jsxs("div", { className: styles.serviceHeader, children: [_jsx("span", { className: styles.tag, children: "\u4EAB" }), _jsx("span", { className: styles.serviceLabel, children: "\u4EAB\u53D7\u670D\u52A1\u4FE1\u606F" })] }) }), _jsx("div", { className: styles.infoTable, children: packageData.details.map((item, index) => (_jsxs("div", { className: styles.tableRow, children: [_jsx("div", { className: styles.tableCell, children: _jsx("span", { className: styles.cellLabel, children: item.label }) }), _jsx("div", { className: styles.tableCell, children: _jsx("span", { className: styles.cellValue, children: item.value }) })] }, index))) }), _jsx("div", { className: styles.spacer })] }));
};
export default RoomPackageDetail;
//# sourceMappingURL=index.js.map
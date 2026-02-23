import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { CheckIcon, CrossIcon } from '../../../icons';
import styles from './index.module.scss';
const RoomDrawerPolicy = ({ room, data, cancelMinutes = 30, checkInDate = '2026-02-21', checkInTime = '14:00', checkOutTime = '12:00', deadlineTime = 24, // 默认24小时
amenities = {
    baby: true,
    children: true,
    elderly: true,
    overseas: true,
    hongKongMacaoTaiwan: true,
    pets: false,
}, }) => {
    // 解析日期时间，生成表格数据
    const generateCancellationPolicies = () => {
        // 解析checkInDate (YYYY-MM-DD)
        const [year, month, day] = checkInDate.split('-');
        const checkInDateStr = `${month}月${day}日`;
        // 计算deadline时间：checkInTime + deadlineTime小时
        const [checkInHour, checkInMin] = checkInTime.split(':').map(Number);
        const deadlineHour = (checkInHour + deadlineTime) % 24;
        const addDays = Math.floor((checkInHour + deadlineTime) / 24);
        // 计算deadline日期
        const checkInDateObj = new Date(Number(year), Number(month) - 1, Number(day));
        const deadlineDateObj = new Date(checkInDateObj.getFullYear(), checkInDateObj.getMonth(), checkInDateObj.getDate() + addDays);
        const deadlineMonth = String(deadlineDateObj.getMonth() + 1).padStart(2, '0');
        const deadlineDay = String(deadlineDateObj.getDate()).padStart(2, '0');
        const deadlineDateStr = `${deadlineMonth}月${deadlineDay}日`;
        const deadlineTimeStr = `${String(deadlineHour).padStart(2, '0')}:${String(checkInMin).padStart(2, '0')}`;
        return [
            {
                // 第一行：当前阶段 + 入住日期 + 入住时间前
                firstRow: true,
                timeRange: `${checkInDateStr} ${checkInTime}前`,
                cancellationFee: '免费取消',
            },
            {
                // 第二行：两行文本
                secondRow: true,
                timeRange: `${checkInDateStr} ${checkInTime}后\n${deadlineDateStr} ${deadlineTimeStr}前`,
                cancellationFee: '取消扣首晚房费的\n100%',
            },
            {
                // 第三行：取消全款时间后
                thirdRow: true,
                timeRange: `${deadlineDateStr} ${deadlineTimeStr}后`,
                cancellationFee: '取消扣全款',
            },
        ];
    };
    const cancellationPolicies = generateCancellationPolicies();
    const amenityItems = [
        { label: '接待婴儿', enabled: amenities.baby },
        { label: '接待儿童', enabled: amenities.children },
        { label: '接待老人', enabled: amenities.elderly },
        { label: '接待海外', enabled: amenities.overseas },
        { label: '接待港澳台', enabled: amenities.hongKongMacaoTaiwan },
        { label: '带宠物', enabled: amenities.pets },
    ];
    return (_jsx("div", { className: styles.section, children: _jsxs("div", { className: styles.content, children: [_jsxs("div", { className: styles.sectionRow, children: [_jsx("h3", { className: styles.sectionTitle, children: "\u5165\u79BB" }), _jsxs("div", { className: styles.checkInOut, children: [_jsxs("div", { className: styles.item, children: [_jsx("span", { className: styles.label, children: "\u5165\u4F4F" }), _jsxs("span", { className: styles.value, children: [checkInTime, "-24:00\u5165\u4F4F"] })] }), _jsxs("div", { className: styles.item, children: [_jsx("span", { className: styles.label, children: "\u9000\u623F" }), _jsxs("span", { className: styles.value, children: [checkOutTime, "\u524D\u9000\u623F"] })] })] })] }), _jsxs("div", { className: styles.sectionRow, children: [_jsx("div", { className: styles.sectionTitleWrapper, children: _jsx("h3", { className: styles.sectionTitle, children: "\u9000\u8BA2" }) }), _jsxs("div", { className: styles.sectionContent, children: [_jsxs("div", { className: styles.highlight, children: [cancelMinutes, "\u5206\u949F\u5185\u514D\u8D39\u53D6\u6D88"] }), _jsxs("p", { className: styles.description, children: ["\u8BA2\u5355\u786E\u8BA4", cancelMinutes, "\u5206\u949F\u540E\uFF0C\u53D6\u6D88\u8BA2\u5355\u5C06\u6263\u9664\u5168\u90E8\u623F\u8D39\uFF08\u8BA2\u5355\u9700\u7B49\u5546\u5BB6\u786E\u8BA4\u751F\u6548\uFF0C\u8BA2\u5355\u786E\u8BA4\u7ED3\u679C\u4EE5\u516C\u4F17\u53F7\u3001\u77ED\u4FE1\u6216app\u901A\u77E5\u4E3A\u51C6\uFF0C\u5982\u8BA2\u5355\u4E0D\u786E\u8BA4\u5C06\u5168\u989D\u9000\u6B3E\u81F3\u4F60\u7684\u4ED8\u6B3E\u8D26\u53F7\uFF09"] })] })] }), _jsx("div", { className: styles.tableSection, children: _jsxs("table", { className: styles.policyTable, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\u9000\u8BA2\u65F6\u95F4" }), _jsx("th", { children: "\u9000\u8BA2\u8D39\u7528" })] }) }), _jsx("tbody", { children: cancellationPolicies.map((policy, idx) => (_jsxs("tr", { children: [_jsx("td", { children: _jsxs("div", { className: styles.timeCell, children: [idx === 0 && (_jsxs(_Fragment, { children: [_jsx("span", { className: styles.tag, children: "\u5F53\u524D\u9636\u6BB5" }), _jsx("div", { children: policy.timeRange })] })), idx === 1 &&
                                                        policy.timeRange.split('\n').map((line, i) => _jsx("div", { children: line }, i)), idx === 2 && _jsx("div", { children: policy.timeRange })] }) }), _jsx("td", { children: _jsx("div", { className: styles.feeCell, children: policy.cancellationFee }) })] }, idx))) })] }) }), _jsxs("div", { className: styles.sectionRow, children: [_jsx("div", { className: styles.sectionTitleWrapper, children: _jsx("h3", { className: styles.sectionTitle, children: "\u8981\u6C42" }) }), _jsx("div", { className: styles.amenitiesGrid, children: amenityItems.map((item, idx) => (_jsxs("div", { className: styles.amenityItem, children: [item.enabled ? (_jsx(CheckIcon, { width: 20, height: 20 })) : (_jsx(CrossIcon, { width: 20, height: 20 })), _jsx("span", { className: styles.amenityLabel, children: item.label })] }, idx))) })] })] }) }));
};
export { RoomDrawerPolicy };
export default RoomDrawerPolicy;
//# sourceMappingURL=index.js.map
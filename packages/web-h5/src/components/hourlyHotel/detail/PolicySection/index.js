import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { TipIcon, CheckIcon, CrossIcon } from '../../icons';
import styles from './index.module.scss';
const PolicySection = ({ data, cancelMinutes = 30, checkInDate = '2026-02-21', checkInTime = '14:00', checkOutTime = '12:00', deadlinetime = 24, // 默认入住后24小时
amenities = {
    baby: true,
    children: true,
    elderly: true,
    overseas: true,
    hongKongMacaoTaiwan: true,
    pets: false,
}, }) => {
    // 根据 checkInDate + checkInTime + deadlinetime 计算 cancelDeadlineTime
    const calculateCancelDeadlineTime = () => {
        const [year, month, day, ...rest] = checkInDate.split('-');
        const [hours, minutes] = checkInTime.split(':');
        // 创建入住时间的Date对象
        const checkInDateTime = new Date(`${year}-${month}-${day}T${hours}:${minutes}:00`);
        // 加上deadline小时数
        checkInDateTime.setHours(checkInDateTime.getHours() + deadlinetime);
        // 格式化为 "MMdd HH:mm"
        const deadlineMonth = String(checkInDateTime.getMonth() + 1).padStart(2, '0');
        const deadlineDay = String(checkInDateTime.getDate()).padStart(2, '0');
        const deadlineHours = String(checkInDateTime.getHours()).padStart(2, '0');
        const deadlineMinutes = String(checkInDateTime.getMinutes()).padStart(2, '0');
        return `${deadlineMonth}${deadlineDay} ${deadlineHours}:${deadlineMinutes}`;
    };
    // 生成取消政策表格数据
    const generateCancellationPolicies = () => {
        const cancelDeadlineTime = calculateCancelDeadlineTime();
        // 解析checkInDate (YYYY-MM-DD)
        const [year, month, day] = checkInDate.split('-');
        const checkInDateStr = `${month}月${day}日`;
        // 解析deadline时间 (MMdd HH:mm)
        const deadlineMonth = cancelDeadlineTime.substring(0, 2);
        const deadlineDay = cancelDeadlineTime.substring(2, 4);
        const deadlineTime = cancelDeadlineTime.substring(5);
        const deadlineDateStr = `${deadlineMonth}月${deadlineDay}日`;
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
                timeRange: `${checkInDateStr} ${checkInTime}后\n${deadlineDateStr} ${deadlineTime}前`,
                cancellationFee: '取消扣首晚房费的\n100%',
            },
            {
                // 第三行：取消全款时间后
                thirdRow: true,
                timeRange: `${deadlineDateStr} ${deadlineTime}后`,
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
    return (_jsxs("div", { className: styles.section, children: [_jsxs("div", { className: styles.header, children: [_jsx("h2", { className: styles.title, children: "\u9884\u8BA2\u987B\u77E5" }), _jsxs("button", { className: styles.allPoliciesBtn, children: ["\u5168\u90E8\u987B\u77E5 ", _jsx("span", { className: styles.arrow, children: "\u203A" })] })] }), _jsxs("div", { className: styles.tipContainer, children: [_jsx(TipIcon, { width: 16, height: 16 }), _jsx("span", { className: styles.tipText, children: "\u4EE5\u4E0B\u89C4\u5219\u7531\u623F\u4E1C\u5236\u5B9A\uFF0C\u8BF7\u4ED4\u7EC6\u8BFB\u5E76\u9075\u5B88" })] }), _jsxs("div", { className: styles.content, children: [_jsxs("div", { className: styles.sectionRow, children: [_jsx("h3", { className: styles.sectionTitle, children: "\u5165\u79BB" }), _jsxs("div", { className: styles.checkInOut, children: [_jsxs("div", { className: styles.item, children: [_jsx("span", { className: styles.label, children: "\u5165\u4F4F" }), _jsxs("span", { className: styles.value, children: [checkInTime, "-24:00\u5165\u4F4F"] })] }), _jsxs("div", { className: styles.item, children: [_jsx("span", { className: styles.label, children: "\u9000\u623F" }), _jsxs("span", { className: styles.value, children: [checkOutTime, "\u524D\u9000\u623F"] })] })] })] }), _jsxs("div", { className: styles.sectionRow, children: [_jsx("div", { className: styles.sectionTitleWrapper, children: _jsx("h3", { className: styles.sectionTitle, children: "\u9000\u8BA2" }) }), _jsxs("div", { className: styles.sectionContent, children: [_jsxs("div", { className: styles.highlight, children: [cancelMinutes, "\u5206\u949F\u5185\u514D\u8D39\u53D6\u6D88"] }), _jsxs("p", { className: styles.description, children: ["\u8BA2\u5355\u786E\u8BA4", cancelMinutes, "\u5206\u949F\u540E\uFF0C\u53D6\u6D88\u8BA2\u5355\u5C06\u6263\u9664\u5168\u90E8\u623F\u8D39\uFF08\u8BA2\u5355\u9700\u7B49\u5546\u5BB6\u786E\u8BA4\u751F\u6548\uFF0C\u8BA2\u5355\u786E\u8BA4\u7ED3\u679C\u4EE5\u516C\u4F17\u53F7\u3001\u77ED\u4FE1\u6216app\u901A\u77E5\u4E3A\u51C6\uFF0C\u5982\u8BA2\u5355\u4E0D\u786E\u8BA4\u5C06\u5168\u989D\u9000\u6B3E\u81F3\u4F60\u7684\u4ED8\u6B3E\u8D26\u53F7\uFF09"] })] })] }), _jsx("div", { className: styles.tableSection, children: _jsxs("table", { className: styles.policyTable, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\u9000\u8BA2\u65F6\u95F4" }), _jsx("th", { children: "\u9000\u8BA2\u8D39\u7528" })] }) }), _jsx("tbody", { children: cancellationPolicies.map((policy, idx) => (_jsxs("tr", { children: [_jsx("td", { children: _jsxs("div", { className: styles.timeCell, children: [idx === 0 && (_jsxs(_Fragment, { children: [_jsx("span", { className: styles.tag, children: "\u5F53\u524D\u9636\u6BB5" }), _jsx("div", { children: policy.timeRange })] })), idx === 1 && policy.timeRange.split('\n').map((line, i) => (_jsx("div", { children: line }, i))), idx === 2 && _jsx("div", { children: policy.timeRange })] }) }), _jsx("td", { children: _jsx("div", { className: styles.feeCell, children: policy.cancellationFee }) })] }, idx))) })] }) }), _jsxs("div", { className: styles.sectionRow, children: [_jsx("div", { className: styles.sectionTitleWrapper, children: _jsx("h3", { className: styles.sectionTitle, children: "\u8981\u6C42" }) }), _jsx("div", { className: styles.amenitiesGrid, children: amenityItems.map((item, idx) => (_jsxs("div", { className: styles.amenityItem, children: [item.enabled ? (_jsx(CheckIcon, { width: 20, height: 20 })) : (_jsx(CrossIcon, { width: 20, height: 20 })), _jsx("span", { className: styles.amenityLabel, children: item.label })] }, idx))) })] })] })] }));
};
export default PolicySection;
//# sourceMappingURL=index.js.map
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * 预订须知区
 */
import { useState } from 'react';
import { useHomestayStore } from '@estay/shared';
import PropertyCardContainer from '../PropertyCardContainer';
import RoomDetailDrawer from '../../../../pages/RoomDetail/homeStay';
import { TipIcon, CheckIcon, CrossIcon } from '../../icons';
import styles from './index.module.scss';
/**
 * PolicySection 内容组件
 */
const PolicySectionContent = ({ policies: middlewarePolicies, checkInDate: propsCheckInDate, checkOutDate, }) => {
    // 从 store 获取 detailContext 中的日期（优先级高于 Props）
    const { detailContext } = useHomestayStore();
    const storeCheckInDate = detailContext?.checkInDate;
    // 优先使用 store 中的日期，再用 Props，最后用默认值
    let checkInDate = storeCheckInDate || propsCheckInDate;
    // 如果还是没有，使用默认值（MM-DD 格式的今天）
    if (!checkInDate) {
        const now = new Date();
        checkInDate = `${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
    // 日期时间计算辅助函数 - 从指定日期和时间加上小时数
    const addHoursToDateTime = (mmdd, timeStr, hoursToAdd) => {
        if (!mmdd || !timeStr)
            return { date: '', time: '' };
        // 解析 MM-DD 格式
        const [month, day] = mmdd.split('-').map(Number);
        // 解析 HH:MM 格式
        const [hour, min] = timeStr.split(':').map(Number);
        const now = new Date();
        // 创建日期对象（使用当前年份作为基准）
        let date = new Date(now.getFullYear(), month - 1, day, hour, min);
        // 添加小时
        date.setHours(date.getHours() + hoursToAdd);
        // 返回格式化后的日期和时间
        const resultMonth = String(date.getMonth() + 1).padStart(2, '0');
        const resultDay = String(date.getDate()).padStart(2, '0');
        const resultHour = String(date.getHours()).padStart(2, '0');
        const resultMin = String(date.getMinutes()).padStart(2, '0');
        return {
            date: `${resultMonth}月${resultDay}日`,
            time: `${resultHour}:${resultMin}`,
        };
    };
    // 解析日期时间，生成表格数据
    const generateCancellationPolicies = () => {
        const checkInSpan = middlewarePolicies?.checkInSpan?.[0];
        const checkoutTime = middlewarePolicies?.checkoutTime;
        const deadlineTime = middlewarePolicies?.deadlineTime;
        if (!checkInSpan || !checkoutTime || !deadlineTime || !checkInDate) {
            return [];
        }
        // 获取入住时间范围的开始时间作为 cancellationHour
        const cancellationHour = checkInSpan.early; // 如 '14:00'
        // 计算各个时间点（第一个时间点，加0小时）
        const firstTimepoint = addHoursToDateTime(checkInDate, cancellationHour, 0);
        // 计算第二个时间点，加上deadlineTime小时
        const secondTimepoint = addHoursToDateTime(checkInDate, cancellationHour, deadlineTime);
        return [
            {
                timeRange: `${firstTimepoint.date} ${firstTimepoint.time}前`,
                cancellationFee: '免费取消',
            },
            {
                timeRange: `${firstTimepoint.date} ${firstTimepoint.time}后\n${secondTimepoint.date} ${secondTimepoint.time}前`,
                cancellationFee: '取消扣首晚房费的\n100%',
            },
            {
                timeRange: `${secondTimepoint.date} ${secondTimepoint.time}后`,
                cancellationFee: '取消扣全款',
            },
        ];
    };
    const cancellationPolicies = generateCancellationPolicies();
    const amenities = middlewarePolicies?.amenities;
    const amenityItems = [
        { label: '接待婴儿', enabled: amenities?.baby },
        { label: '接待儿童', enabled: amenities?.children },
        { label: '接待老人', enabled: amenities?.elderly },
        { label: '接待海外', enabled: amenities?.overseas },
        { label: '接待港澳台', enabled: amenities?.hongKongMacaoTaiwan },
        { label: '带宠物', enabled: amenities?.pets },
    ];
    return (_jsx(_Fragment, { children: _jsxs("div", { className: styles.content, children: [_jsxs("div", { className: styles.sectionRow, children: [_jsx("h3", { className: styles.sectionTitle, children: "\u5165\u79BB" }), _jsxs("div", { className: styles.checkInOut, children: [_jsxs("div", { className: styles.item, children: [_jsx("span", { className: styles.label, children: "\u5165\u4F4F" }), _jsxs("span", { className: styles.value, children: [middlewarePolicies?.checkInSpan?.[0]?.early, "-", middlewarePolicies?.checkInSpan?.[0]?.later, "\u5165\u4F4F"] })] }), _jsxs("div", { className: styles.item, children: [_jsx("span", { className: styles.label, children: "\u9000\u623F" }), _jsxs("span", { className: styles.value, children: [middlewarePolicies?.checkoutTime, "\u524D\u9000\u623F"] })] })] })] }), _jsxs("div", { className: styles.sectionRow, children: [_jsx("div", { className: styles.sectionTitleWrapper, children: _jsx("h3", { className: styles.sectionTitle, children: "\u9000\u8BA2" }) }), _jsxs("div", { className: styles.sectionContent, children: [_jsxs("div", { className: styles.highlight, children: [middlewarePolicies?.cancelMinute, "\u5206\u949F\u5185\u514D\u8D39\u53D6\u6D88"] }), _jsxs("p", { className: styles.description, children: ["\u8BA2\u5355\u786E\u8BA4", middlewarePolicies?.cancelMinute, "\u5206\u949F\u540E\uFF0C\u53D6\u6D88\u8BA2\u5355\u5C06\u6263\u9664\u5168\u90E8\u623F\u8D39\uFF08\u8BA2\u5355\u9700\u7B49\u5546\u5BB6\u786E\u8BA4\u751F\u6548\uFF0C\u8BA2\u5355\u786E\u8BA4\u7ED3\u679C\u4EE5\u516C\u4F17\u53F7\u3001\u77ED\u4FE1\u6216app\u901A\u77E5\u4E3A\u51C6\uFF0C\u5982\u8BA2\u5355\u4E0D\u786E\u8BA4\u5C06\u5168\u989D\u9000\u6B3E\u81F3\u4F60\u7684\u4ED8\u6B3E\u8D26\u53F7\uFF09"] })] })] }), _jsx("div", { className: styles.tableSection, children: _jsxs("table", { className: styles.policyTable, children: [_jsx("thead", { children: _jsxs("tr", { children: [_jsx("th", { children: "\u9000\u8BA2\u65F6\u95F4" }), _jsx("th", { children: "\u9000\u8BA2\u8D39\u7528" })] }) }), _jsx("tbody", { children: cancellationPolicies.map((policy, idx) => (_jsxs("tr", { children: [_jsx("td", { children: _jsx("div", { className: styles.timeCell, children: policy.timeRange.split('\n').map((line, i) => _jsx("div", { children: line }, i)) }) }), _jsx("td", { children: _jsx("div", { className: styles.feeCell, children: policy.cancellationFee }) })] }, idx))) })] }) }), _jsxs("div", { className: styles.sectionRow, children: [_jsx("div", { className: styles.sectionTitleWrapper, children: _jsx("h3", { className: styles.sectionTitle, children: "\u8981\u6C42" }) }), _jsx("div", { className: styles.amenitiesGrid, children: amenityItems.map((item, idx) => (_jsxs("div", { className: styles.amenityItem, children: [item.enabled ? (_jsx(CheckIcon, { width: 20, height: 20 })) : (_jsx(CrossIcon, { width: 20, height: 20 })), _jsx("span", { className: styles.amenityLabel, children: item.label })] }, idx))) })] })] }) }));
};
const PolicySection = ({ facilitiesData, feeInfoData, policies, }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    // 创建虚拟room对象用于显示政策信息
    const policyRoom = {
        id: 'policy',
        name: '预订须知',
        area: '',
        beds: '',
        guests: '',
        image: '',
        priceList: [],
        priceNote: '',
        benefits: [],
        packageCount: 0,
    };
    const handleOpenAllPolicies = () => {
        setIsDrawerOpen(true);
    };
    const handleCloseDrawer = () => {
        setIsDrawerOpen(false);
    };
    return (_jsxs(_Fragment, { children: [_jsx(PropertyCardContainer, { headerConfig: {
                    show: true,
                    title: {
                        text: '预订须知',
                        show: true,
                    },
                    textButton: {
                        text: '全部须知',
                        show: true,
                        onClick: handleOpenAllPolicies,
                    },
                    tipTag: {
                        show: true,
                        icon: TipIcon,
                        text: '以下规则由房东制定，请仔细读并遵守',
                    },
                }, children: _jsx(PolicySectionContent, { policies: policies }) }), _jsx(RoomDetailDrawer, { room: isDrawerOpen ? policyRoom : null, isOpen: isDrawerOpen, onClose: handleCloseDrawer, scrollToPolicy: true, facilitiesData: facilitiesData, feeInfoData: feeInfoData })] }));
};
export { PolicySection };
export default PolicySection;
//# sourceMappingURL=index.js.map
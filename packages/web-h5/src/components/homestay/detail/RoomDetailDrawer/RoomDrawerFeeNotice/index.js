import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import PropertyCardContainer from '../../PropertyCardContainer';
import { TipIcon } from '../../../icons';
import styles from './index.module.scss';
const RoomDrawerFeeNotice = ({ room, deposit = 500, standardGuests = 2, joinNumber = 2, joinPrice = 100, otherDescription = '', showOther = false, }) => {
    return (_jsx(PropertyCardContainer, { headerConfig: {
            show: true,
            title: {
                text: '费用须知',
                show: true,
            },
            tipTag: {
                show: true,
                icon: TipIcon,
                text: '请仔细阅读费用相关说明',
            },
        }, children: _jsxs("div", { className: styles.feeNoticeList, children: [_jsxs("div", { className: styles.feeRow, children: [_jsx("div", { className: styles.feeTitle, children: "\u62BC\u91D1" }), _jsxs("div", { className: styles.feeContent, children: ["\u00A5", deposit, "\uFF0C\u4E0B\u5355\u65F6\u652F\u4ED8\uFF0C\u79BB\u5E97\u540E\u539F\u8DEF\u9000\u8FD8\uFF0C\u65E0\u7EA0\u7EB7\u4E0D\u6263\u62BC"] })] }), _jsxs("div", { className: styles.feeRow, children: [_jsx("div", { className: styles.feeTitle, children: "\u52A0\u4EBA" }), _jsxs("div", { className: styles.feeContent, children: ["\u6807\u51C6\u5165\u4F4F", standardGuests, "\u4EBA\uFF0C", joinNumber === 0 ? '不可加人' : `可加${joinNumber}人，¥${joinPrice}/人/晚`] })] }), showOther && (_jsxs(_Fragment, { children: [_jsxs("div", { className: styles.feeRow, children: [_jsx("div", { className: styles.feeTitle, children: "\u5176\u4ED6" }), _jsx("div", { className: styles.feeContent, children: "\u8BF7\u4ED4\u7EC6\u9605\u8BFB\u623F\u4E1C\u5176\u4ED6\u8981\u6C42" })] }), _jsx("div", { className: styles.otherDescriptionContainer, children: _jsx("div", { className: styles.otherDescriptionTextFull, children: otherDescription }) })] }))] }) }));
};
export default RoomDrawerFeeNotice;
//# sourceMappingURL=index.js.map
/**
 * 费用须知区 - 显示押金、加人、其他费用信息
 */
import React from 'react';
interface FeeNoticeSectionProps {
    deposit: number;
    standardGuests: number;
    joinNumber: number;
    joinPrice: number;
    otherDescription?: string;
    showOther?: boolean;
    roomName?: string;
}
declare const FeeNoticeSection: React.FC<FeeNoticeSectionProps>;
export default FeeNoticeSection;
export type { FeeNoticeSectionProps };
//# sourceMappingURL=index.d.ts.map
/**
 * 预订须知区
 */
import React from 'react';
interface PolicySectionProps {
    room?: any;
    data?: any;
    cancelMinutes?: number;
    checkInDate?: string;
    checkInTime?: string;
    checkOutTime?: string;
    deadlineTime?: number;
    amenities?: {
        baby?: boolean;
        children?: boolean;
        elderly?: boolean;
        overseas?: boolean;
        hongKongMacaoTaiwan?: boolean;
        pets?: boolean;
    };
    roomName?: string;
}
declare const PolicySection: React.FC<PolicySectionProps>;
export { PolicySection };
export type { PolicySectionProps };
export default PolicySection;
//# sourceMappingURL=index.d.ts.map
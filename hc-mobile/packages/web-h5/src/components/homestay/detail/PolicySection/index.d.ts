/**
 * 预订须知区
 */
import React from 'react';
interface PolicySectionProps {
    data?: any;
    cancelMinutes?: number;
    checkInDate?: string;
    checkInTime?: string;
    checkOutTime?: string;
    deadlinetime?: number;
    amenities?: {
        baby?: boolean;
        children?: boolean;
        elderly?: boolean;
        overseas?: boolean;
        hongKongMacaoTaiwan?: boolean;
        pets?: boolean;
    };
}
declare const PolicySection: React.FC<PolicySectionProps>;
export default PolicySection;
//# sourceMappingURL=index.d.ts.map
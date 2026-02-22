/**
 * 预订须知区
 */
import React from 'react';
interface RoomDrawerPolicyProps {
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
}
declare const RoomDrawerPolicy: React.FC<RoomDrawerPolicyProps>;
export { RoomDrawerPolicy };
export type { RoomDrawerPolicyProps };
export default RoomDrawerPolicy;
//# sourceMappingURL=index.d.ts.map
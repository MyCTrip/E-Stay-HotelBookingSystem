/**
 * 设施筛选组件 - 内容only
 */
import React from 'react';
interface FacilityFilterProps {
    selectedFacilities?: string[];
    onFacilitiesChange?: (facilities: string[]) => void;
    onConfirm?: () => void;
}
declare const FacilityFilter: React.FC<FacilityFilterProps>;
export default FacilityFilter;
//# sourceMappingURL=index.d.ts.map
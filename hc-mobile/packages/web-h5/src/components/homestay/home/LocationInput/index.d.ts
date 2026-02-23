/**
 * 地点输入组件 - Web H5版本
 */
import React from 'react';
interface LocationInputProps {
    value?: string;
    city?: string;
    placeholder?: string;
    onLocationSelect?: (location: string) => void;
    onCityChange?: (city: string) => void;
    onNearbyClick?: () => void;
    onChange?: (value: string) => void;
    loading?: boolean;
}
declare const _default: React.NamedExoticComponent<LocationInputProps>;
export default _default;
//# sourceMappingURL=index.d.ts.map
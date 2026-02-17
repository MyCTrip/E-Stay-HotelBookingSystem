/**
 * 价格滑块筛选组件
 */
import React from 'react';
interface PriceSliderProps {
    min: number;
    max: number;
    onChange?: (min: number, max: number) => void;
    minRange?: number;
    maxRange?: number;
}
declare const PriceSlider: React.FC<PriceSliderProps>;
export default PriceSlider;
//# sourceMappingURL=PriceSlider.d.ts.map
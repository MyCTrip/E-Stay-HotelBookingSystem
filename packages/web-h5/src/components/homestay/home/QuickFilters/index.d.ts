/**
 * 快捷筛选标签组件 - Web H5版本
 */
import React from 'react';
import type { QuickFilterTag } from '@estay/shared';
interface QuickFiltersProps {
    tags?: QuickFilterTag[];
    selectedTags?: string[];
    onTagSelect?: (tagId: string, selected: boolean) => void;
    maxSelect?: number;
}
declare const _default: React.NamedExoticComponent<QuickFiltersProps>;
export default _default;
//# sourceMappingURL=index.d.ts.map
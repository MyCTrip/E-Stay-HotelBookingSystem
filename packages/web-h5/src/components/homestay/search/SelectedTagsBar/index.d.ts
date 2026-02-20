/**
 * 已选条件标签栏
 */
import React from 'react';
interface SelectedTagsBarProps {
    tags: Array<{
        key: string;
        label: string;
    }>;
    onTagRemove: (key: string) => void;
    onResetAll: () => void;
}
declare const SelectedTagsBar: React.FC<SelectedTagsBarProps>;
export default SelectedTagsBar;
//# sourceMappingURL=index.d.ts.map
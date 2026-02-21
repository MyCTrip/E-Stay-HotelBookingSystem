/**
 * SlideDrawer 上下文 - 管理页面内 SlideDrawer 的互斥
 */
import React from 'react';
interface DrawerInstance {
    id: string;
    onClose: () => void;
}
interface SlideDrawerContextType {
    registerDrawer: (drawer: DrawerInstance) => void;
    unregisterDrawer: (id: string) => void;
    openDrawer: (id: string) => void;
}
/**
 * SlideDrawer 上下文提供者
 */
export declare const SlideDrawerProvider: React.FC<{
    children: React.ReactNode;
}>;
/**
 * 使用 SlideDrawer 上下文的 Hook
 */
export declare const useSlideDrawerContext: () => SlideDrawerContextType | undefined;
export {};
//# sourceMappingURL=context.d.ts.map
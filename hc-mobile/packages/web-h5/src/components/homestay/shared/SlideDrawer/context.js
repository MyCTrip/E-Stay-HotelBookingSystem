import { jsx as _jsx } from "react/jsx-runtime";
/**
 * SlideDrawer 上下文 - 管理页面内 SlideDrawer 的互斥
 */
import { createContext, useContext, useRef, useCallback } from 'react';
const SlideDrawerContext = createContext(undefined);
/**
 * SlideDrawer 上下文提供者
 */
export const SlideDrawerProvider = ({ children }) => {
    const drawersRef = useRef(new Map());
    const registerDrawer = useCallback((drawer) => {
        drawersRef.current.set(drawer.id, drawer);
    }, []);
    const unregisterDrawer = useCallback((id) => {
        drawersRef.current.delete(id);
    }, []);
    const openDrawer = useCallback((id) => {
        // 关闭所有其他打开的 drawer
        drawersRef.current.forEach((drawer, drawerId) => {
            if (drawerId !== id) {
                drawer.onClose();
            }
        });
    }, []);
    const value = {
        registerDrawer,
        unregisterDrawer,
        openDrawer,
    };
    return _jsx(SlideDrawerContext.Provider, { value: value, children: children });
};
/**
 * 使用 SlideDrawer 上下文的 Hook
 */
export const useSlideDrawerContext = () => {
    const context = useContext(SlideDrawerContext);
    if (!context) {
        // 将 context 值改为 undefined，这样如果在没有 Provider 的情况下使用，会返回 undefined
        // 这样组件可以检查是否在 Provider 中
        return undefined;
    }
    return context;
};
//# sourceMappingURL=context.js.map
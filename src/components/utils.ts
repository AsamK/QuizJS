import type { DependencyList, EffectCallback } from 'react';
import React from 'react';

/**
 * The effect will be called when deps have changed (determined by useEffect hook)
 * and when the page visibility changes to visible.
 * The optional cleanup function that can be returned by the effect will be called
 * when deps have changed or when the page visibility changes to hidden.
 */
export function useRefresh(effect: EffectCallback, deps?: DependencyList): void {
    React.useEffect(() => {
        let userCleanup: ReturnType<EffectCallback>;
        function handleVisibilityChange(): void {
            if (!document.hidden) {
                userCleanup = effect();
            } else {
                if (userCleanup) {
                    userCleanup();
                    userCleanup = undefined;
                }
            }
        }

        function cleanUp(): void {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            if (userCleanup) {
                userCleanup();
                userCleanup = undefined;
            }
        }

        userCleanup = effect();
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return cleanUp;
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
}

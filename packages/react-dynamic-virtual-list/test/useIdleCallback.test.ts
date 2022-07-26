import { afterEach, beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { describe, vi, it, expect } from 'vitest';
import useIdleCallback from '../src/hooks/useIdleCallback';
import idleCallbackMocker from './idleCallback';

describe("useIdleCallback", () => {
   

    describe('supported', () => {
        beforeEach(() => {
            idleCallbackMocker.mock()
        })
    
        afterEach(() => {
            idleCallbackMocker.restore()
            console.log(cancelIdleCallback)
        })

        it('should call when browser becomes idle', () => {
            const callback = vi.fn()

            renderHook(() => useIdleCallback(callback))
            expect(callback).not.toHaveBeenCalled()
            idleCallbackMocker.runIdleCallbacks()
            expect(callback).toHaveBeenCalledOnce()
        })

        it('should cancel IdleCallback when unmounted', () => {
            const callback = vi.fn()

            const {unmount} = renderHook(() => useIdleCallback(callback))
            unmount()
            idleCallbackMocker.runIdleCallbacks()
            expect(callback).not.toHaveBeenCalled()
        })
    })
})
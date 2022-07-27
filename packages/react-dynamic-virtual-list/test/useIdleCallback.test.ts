import { afterEach, beforeEach } from 'vitest';
import { renderHook, cleanup } from '@testing-library/react';
import { describe, vi, it, expect } from 'vitest';
import useIdleCallback from '../src/hooks/useIdleCallback';
import idleCallbackMocker from './idleCallback';

describe("useIdleCallback", () => {
    describe('supported', () => {
        beforeEach(() => {
            idleCallbackMocker.mock()
        })

        afterEach(() => {
            cleanup()
            idleCallbackMocker.restore()
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

            const { unmount } = renderHook(() => useIdleCallback(callback))
            unmount()
            idleCallbackMocker.runIdleCallbacks()
            expect(callback).not.toHaveBeenCalled()
        })

        it('should cancel previous IdleCallback when callback changes', () => {
            const callback = vi.fn() as any
            const callback2 = vi.fn()

            const { rerender } = renderHook((props: { fn: () => void }) => {
                return useIdleCallback(props.fn)
            }, {
                initialProps: {
                    fn: callback
                }
            })

            rerender({ fn: callback2 })

            idleCallbackMocker.runIdleCallbacks()
            expect(callback).not.toHaveBeenCalled()
            expect(callback2).toHaveBeenCalled()
        })

        it('should cancel previous IdleCallback when options changes', () => {
            const callback = vi.fn() as any

            const { rerender } = renderHook((props: { options?: IdleRequestOptions }) => {
                return useIdleCallback(callback, props.options)
            }, {
                initialProps: {}
            })

            rerender({ options: undefined })
            expect(cancelIdleCallback).not.toHaveBeenCalled()

            rerender({ options: { timeout: 10 } })
            expect(cancelIdleCallback).toHaveBeenCalled()
            rerender({ options: { timeout: 10 } })
            expect(cancelIdleCallback).toHaveBeenCalledOnce()

            rerender({ options: { timeout: 20 } })
            expect(cancelIdleCallback).toHaveBeenCalledTimes(2)
        })
    })

    describe('upsupported with setTimeout', () => {

        beforeEach(() => {
            idleCallbackMocker.mockUnSupport()
            vi.useFakeTimers()
        })

        afterEach(() => {
            cleanup()
            idleCallbackMocker.restore()
            vi.restoreAllMocks()
        })

        it('should call when browser becomes idle', () => {
            const callback = vi.fn()

            renderHook(() => useIdleCallback(callback, {timeout: 100}))
            expect(callback).not.toHaveBeenCalled()
            vi.advanceTimersByTime(100)
            expect(callback).toHaveBeenCalledOnce()
        })
    })
})
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useTrackingValue from "../src/hooks/useTrackingValue";

describe('useTrackingValue', () => {
    it('should not call onChange when first render', () => {
        const fn = vi.fn()
        renderHook(() => useTrackingValue(1, fn))
        expect(fn).not.toHaveBeenCalled()
    })

    it('should not called if value not change', () => {
        const fn = vi.fn()
        const { rerender } = renderHook((props: { value: number }) => useTrackingValue(props.value, fn), {
            initialProps: {
                value: 1
            }
        })

        rerender({ value: 1 })
        expect(fn).not.toHaveBeenCalled()
    })

    it('should called if value changes', () => {
        const fn = vi.fn()
        const { rerender } = renderHook((props: { value: number }) => useTrackingValue(props.value, fn), {
            initialProps: {
                value: 1
            }
        })

        rerender({ value: 2 })
        expect(fn).toHaveBeenCalledOnce()
    })
})
import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import useTrackingValue from "../src/hooks/useTrackingValue";

describe('useTrackingValue', () => {
    it('should call onChange when first render', () => {
        const fn = vi.fn()
        renderHook(() => useTrackingValue(1, fn))
        expect(fn).not.toHaveBeenCalled()
    })
})
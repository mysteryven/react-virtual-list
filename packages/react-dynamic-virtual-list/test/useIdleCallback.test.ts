import { beforeEach } from 'vitest';
import { renderHook } from '@testing-library/react';
import { describe, vi, it, expect } from 'vitest';
import useIdleCallback from '../src/hooks/useIdleCallback';


const callbackMap: Map<number, Function> = new Map()

function runIdleCallbacks() {
    console.log(callbackMap.size)
    for (let [_, value] of callbackMap) {
        value()
    }
}

let i = 1;

vi.stubGlobal('requestIdleCallback', (callback: () => void) => {
    callbackMap.set(i++, callback)
    return i
})

vi.stubGlobal('cancelIdleCallback', (id: number) => {
    callbackMap.delete(id)
    console.log(callbackMap.size,id, 'cancelIdleCallback')
})


describe("useIdleCallback", () => {
    beforeEach(() => {
        callbackMap.clear()
        i = 0
    })


    describe('supported', () => {
        it('should call when browser becomes idle', () => {
            const callback = vi.fn()

            renderHook(() => useIdleCallback(callback))
            expect(callback).not.toHaveBeenCalled()
            runIdleCallbacks()
            expect(callback).toHaveBeenCalledOnce()
        })

        it('should cancel IdleCallback when unmounted', () => {
            const callback = vi.fn()

            const {unmount} = renderHook(() => useIdleCallback(callback))
            unmount()
            runIdleCallbacks()
            expect(callback).toHaveBeenCalled()
        })
    })
})
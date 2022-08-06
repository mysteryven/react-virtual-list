import { vi } from 'vitest'

const callbackMap: Map<number, Function> = new Map()
let i = 0;

let originRequestAnimationFrame: any = null 
let originCancelAnimationFrame: any = null 

const requestAnimationMocker = {
    mock() {
        originRequestAnimationFrame = globalThis.requestAnimationFrame
        originCancelAnimationFrame = globalThis.cancelAnimationFrame

        vi.stubGlobal('requestAnimationFrame', vi.fn((callback: () => void) => {
            callbackMap.set(++i, callback)
            return i
        }))

        vi.stubGlobal('requestAnimationFrame', vi.fn((id: number) => {
            callbackMap.delete(id)
        }))
    },
    restore() {
        callbackMap.clear()
        i = 0;
        globalThis.requestIdleCallback = originRequestAnimationFrame 
        globalThis.cancelIdleCallback = originCancelAnimationFrame
    },
    runIdleCallbacks: () => {
        for (let [_, value] of callbackMap) {
            value()
        }
    },
    cancelIdleCallbacks: () => {
        callbackMap.clear()
        i = 0
    }
}

export default requestAnimationMocker
import { vi } from 'vitest'

const callbackMap: Map<number, Function> = new Map()
let i = 0;

let originRequestIdleCallback: any = null 
let originCancelIdleCallback: any = null 

const idleCallbackMocker = {
    mock() {
        originRequestIdleCallback = global.requestIdleCallback
        originCancelIdleCallback = global.cancelIdleCallback

        vi.stubGlobal('requestIdleCallback', vi.fn((callback: () => void) => {
            callbackMap.set(++i, callback)
            return i
        }))

        vi.stubGlobal('cancelIdleCallback', vi.fn((id: number) => {
            callbackMap.delete(id)
        }))
    },
    restore() {
        callbackMap.clear()
        i = 0;
        global.requestIdleCallback = originRequestIdleCallback 
        global.cancelIdleCallback = originCancelIdleCallback
    },
    runIdleCallbacks: () => {
        for (let [_, value] of callbackMap) {
            value()
        }
    }
}

export default idleCallbackMocker
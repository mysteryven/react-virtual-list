import { vi } from 'vitest'

const callbackMap: Map<number, Function> = new Map()
let i = 0;

let originRequestIdleCallback: any = null 
let originCancelIdleCallback: any = null 

let isMocking = false

const idleCallbackMocker = {
    mock() {
        if (isMocking) {
            throw new Error('idleCallbackMocker is already mocking')
        }

        isMocking = true
        originRequestIdleCallback = globalThis.requestIdleCallback
        originCancelIdleCallback = globalThis.cancelIdleCallback

        vi.stubGlobal('requestIdleCallback', vi.fn((callback: () => void) => {
            callbackMap.set(++i, callback)
            return i
        }))

        vi.stubGlobal('cancelIdleCallback', vi.fn((id: number) => {
            callbackMap.delete(id)
        }))
    },
    mockUnSupport() {
        if (isMocking) {
            throw new Error('idleCallbackMocker is already mocking')
        }

        isMocking = true
        originRequestIdleCallback = globalThis.requestIdleCallback
        originCancelIdleCallback = globalThis.cancelIdleCallback

        vi.stubGlobal('requestIdleCallback', null)

        vi.stubGlobal('cancelIdleCallback', null)
    },
    restore() {
        isMocking = false
        callbackMap.clear()
        i = 0;
        globalThis.requestIdleCallback = originRequestIdleCallback 
        globalThis.cancelIdleCallback = originCancelIdleCallback
    },
    runIdleCallbacks: () => {
        for (let [_, value] of callbackMap) {
            value()
        }
    }
}

export default idleCallbackMocker
import { vi } from 'vitest'

const callbackMap: Map<number, Function> = new Map()
let i = 0;

let originRequestAnimationFrame: any = null 
let originCancelAnimationFrame: any = null 

const requestAnimationMocker = {
    mock() {
        originRequestAnimationFrame = global.requestAnimationFrame
        originCancelAnimationFrame = global.cancelAnimationFrame

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
        global.requestIdleCallback = originRequestAnimationFrame 
        global.cancelIdleCallback = originCancelAnimationFrame
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
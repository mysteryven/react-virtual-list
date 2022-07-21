import { useEffect, useState } from "react";
import { throttle } from "throttle-debounce";

const defaultEvents = ['mousemove', 'mousedown', 'resize', 'keydown', 'touchstart', 'wheel', 'click']
const oneMinutes = 60e3

export default function useIdle(
    timeout: number = oneMinutes,
    initialState: boolean = false,
    events: string[] = defaultEvents
) {
    const [state, setState] = useState<boolean>(initialState)

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | null = null
        let localState = false
        let mounted = true

        const set = (newState: boolean) => {
            if (mounted) {
                localState = newState
                setState(newState)
            }
        }

        const fn = throttle(50, () => {
            if (localState) {
                setState(false)
            }

            if (timer) {
                clearTimeout(timer)
            }

            setTimeout(() => set(true), timeout)
        })

        const onVisibilityChange = () => {
            console.log(document.hidden)
            if (!document.hidden) {
                fn()
            }
        }

        window.addEventListener('visibilitychange', onVisibilityChange)

        events.forEach(name => {
            window.addEventListener(name, fn)
        })

        timer = setTimeout(() => set(true), timeout)

        return () => {
            mounted = false

            events.forEach(name => {
                window.removeEventListener(name, fn)
            })

            window.removeEventListener('visibilitychange', onVisibilityChange)
        }
    }, [timeout, events])

    return state
}

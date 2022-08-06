import { useEffect, useRef } from "react";
import { UnsupportedBehavior } from "../interface";

export const DEFAULT_TIMEOUT = 1000

export default function useIdleCallback(
    callback: () => void,
    options?: IdleRequestOptions,
    unsupportedBehavior: UnsupportedBehavior = UnsupportedBehavior.timeout
) {
    const handleId = useRef<number | null>(null)

    useEffect(() => {
        if (isSupported()) {
            handleId.current = requestIdleCallback(callback, options)
        } else if(unsupportedBehavior === UnsupportedBehavior.timeout) {
            handleId.current = window.setTimeout(callback, options?.timeout || DEFAULT_TIMEOUT) 
        } else {
            callback()
        }

        return () => {
            if (!handleId.current) {
                return
            }
            if (isSupported()) {
                cancelIdleCallback(handleId.current)
            } else if (unsupportedBehavior === UnsupportedBehavior.timeout) {
                clearTimeout(handleId.current)
            }
        }
    }, [callback, options?.timeout])
}

function isSupported() {

    return typeof globalThis !== 'undefined' &&
        'requestIdleCallback' in globalThis &&
        'cancelIdleCallback' in globalThis &&
        typeof requestIdleCallback === 'function' &&
        typeof cancelIdleCallback === 'function'
}
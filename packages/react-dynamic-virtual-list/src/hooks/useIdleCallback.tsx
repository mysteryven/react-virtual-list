import { useEffect, useRef } from "react";
import { UnsupportedBehavior } from "../interface";

export default function useIdleCallback(
    callback: () => void,
    options?: IdleRequestOptions,
    unsupportedBehavior: UnsupportedBehavior = UnsupportedBehavior.requestAnimation
) {
    const handleId = useRef<number | null>(null)

    useEffect(() => {
        if (isSupported()) {
            handleId.current = requestIdleCallback(callback, options)
        } else if(unsupportedBehavior === UnsupportedBehavior.timeout) {
            handleId.current = window.setTimeout(callback, options?.timeout || 1000) 
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
    return typeof global !== 'undefined' &&
        'requestIdleCallback' in global &&
        'cancelIdleCallback' in global &&
        typeof 'requestIdleCallback' === 'function' &&
        typeof 'cancelIdleCallback' === 'function'
}
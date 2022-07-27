import { useEffect, useRef } from "react";
import { UnsupportedBehavior } from "../interface";

export default function useIdleCallback(
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
    unsupportedBehavior: UnsupportedBehavior = UnsupportedBehavior.requestAnimation
) {
    const handleId = useRef<number | null>(null)

    useEffect(() => {
        if (isSupported()) {
            handleId.current = requestIdleCallback(callback, options)
        } else if(unsupportedBehavior === UnsupportedBehavior.requestAnimation) {
            handleId.current = requestAnimationFrame(callback)
        }

        return () => {
            if (!handleId.current) {
                return
            }
            if (isSupported()) {
                cancelIdleCallback(handleId.current)
            } else if (unsupportedBehavior === UnsupportedBehavior.requestAnimation) {
                cancelAnimationFrame(handleId.current)
            }
        }
    }, [callback, options?.timeout])
}

function isSupported() {
    return typeof global !== 'undefined' &&
        'requestIdleCallback' in global &&
        'cancelIdleCallback' in global
}
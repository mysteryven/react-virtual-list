import { DependencyList, useEffect, useRef } from "react";

export default function useIdleCallback(
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
    deps: DependencyList = []
) {
    const handleId = useRef<number | null>(null)

    useEffect(() => {
        if (isSupported()) {
            handleId.current = requestIdleCallback(callback, options)
        } else {

        }

        return () => {
            if (isSupported() && handleId.current) {
                cancelIdleCallback(handleId.current)
            }
        }
    }, [...deps, callback])
}

function isSupported() {
    return typeof global !== 'undefined' &&
        'requestIdleCallback' in global &&
        'cancelIdleCallback' in global
}
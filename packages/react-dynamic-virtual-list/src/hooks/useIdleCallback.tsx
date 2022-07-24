import { DependencyList, useEffect, useRef } from "react";

export default function useIdleCallback(
    callback: IdleRequestCallback,
    options?: IdleRequestOptions,
    deps: DependencyList = []
) {
    const handle = useRef<IdleRequestCallback | null>(null)

    useEffect(() => {
        handle.current = callback
    })

    useEffect(() => {
        if (isSupported()) {
            
        } else {

        }
    }, deps)
}

function isSupported() {
    return typeof window !== 'undefined' &&
        'requestIdleCallback' in window &&
        'cancelIdleCallback' in window
}
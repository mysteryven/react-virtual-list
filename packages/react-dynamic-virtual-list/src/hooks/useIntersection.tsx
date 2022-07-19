import { RefObject, useEffect, useState } from "react";

export default function useIntersection<T extends Element>(
    ref: RefObject<T>,
    options: IntersectionObserverInit,
    isActive = false
) {
    const [state, setState] = useState<IntersectionObserverEntry | null>();

    useEffect(() => {
        let observer: null | IntersectionObserver = null
        if (isActive && ref.current && typeof IntersectionObserver === 'function') {
            observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
                setState(entries[entries.length - 1])
            }, options);

            observer.observe(ref.current)

            return () => {
                setState(null)
                observer?.disconnect()
            }
        }

        if (!isActive && observer !== null) {
            // @ts-ignore
            observer.disconnect()
        }

        return () => { }
    }, [ref.current, options.threshold, options.root, options.rootMargin, isActive])


    return state
}
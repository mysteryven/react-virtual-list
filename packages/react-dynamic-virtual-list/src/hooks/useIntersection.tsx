import { RefObject, useEffect, useState } from "react";

export default function useIntersection<T extends Element>(
    ref: RefObject<T>,
    options: IntersectionObserverInit,
    isActive?: boolean,
) {
    const [intersectionObserverEntry, setIntersectionObserverEntry] = useState<IntersectionObserverEntry | null>(null);

    useEffect(() => {
        let observer: null | IntersectionObserver = null
        if (isActive && ref.current && typeof IntersectionObserver === 'function') {
            observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
                setIntersectionObserverEntry(entries[0])
            }, options);

            observer.observe(ref.current)

            return () => {
                setIntersectionObserverEntry(null)
                observer?.disconnect()
            }
        }

        if (!isActive && observer) {
            // @ts-ignore
            observer.disconnect()
        }
    }, [
        ref.current,
        Array.isArray(options.threshold) ? options.threshold.join(",") : options.threshold,
        options.root,
        options.rootMargin,
        isActive]
    )

    return intersectionObserverEntry
}
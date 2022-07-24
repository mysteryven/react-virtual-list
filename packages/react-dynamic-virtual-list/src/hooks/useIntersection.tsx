import { RefObject, useEffect, useState } from "react";

export default function useIntersection<T extends Element>(
    ref: RefObject<T>,
    options: IntersectionObserverInit,
    isActive?: boolean,
) {
    const [intersectionObserverEntry, setIntersectionObserverEntry] = useState<IntersectionObserverEntry | null>(null);

    useEffect(() => {
        if (isActive && ref.current && typeof IntersectionObserver === 'function') {
            let observer = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
                setIntersectionObserverEntry(entries[0])
            }, options);

            observer.observe(ref.current)

            return () => {
                setIntersectionObserverEntry(null)
                observer.disconnect()
            }
        }
    },
        [
            ref.current,
            Array.isArray(options.threshold) ? options.threshold.join(",") : options.threshold,
            options.root,
            options.rootMargin,
            isActive
        ]
    )

    return intersectionObserverEntry
}
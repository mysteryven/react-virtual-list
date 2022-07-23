import { vi } from 'vitest'

interface Observer {
    source: unknown
    target: Element;
    callback: IntersectionObserverCallback;
    options?: IntersectionObserverInit;
}

let observers: Observer[] = []

const setObservers = (setter: (observers: Observer[]) => Observer[]) => {
    observers = setter(observers)
}

export function simulate(entry:
    | Partial<IntersectionObserverEntry>
    | Partial<IntersectionObserverEntry>[]
) {
    const arrayOfEntries = Array.isArray(entry) ? entry : [entry]
    const targets = arrayOfEntries.map(entry => entry.target)
    const noCustomTargets = targets.every(target => target !== null)

    for (let observe of observers) {
        if (noCustomTargets || targets.includes(observe.target)) {
            observe.callback(arrayOfEntries.map((entry) => normalizeEntry(entry, observe.target)), observe as any)
        }
    }

}

function normalizeEntry(entry: Partial<IntersectionObserverEntry>, target: Element): IntersectionObserverEntry {
    const isIntersecting =
    entry.isIntersecting == null
      ? Boolean(entry.intersectionRatio)
      : entry.isIntersecting;

  const intersectionRatio = entry.intersectionRatio || (isIntersecting ? 1 : 0);

    return {
        time: entry.time || Date.now(),
        isIntersecting: isIntersecting,
        intersectionRatio: intersectionRatio,
        boundingClientRect: entry.boundingClientRect || target.getBoundingClientRect(),
        intersectionRect: entry.intersectionRect || target.getBoundingClientRect(),
        rootBounds: entry.rootBounds || target.getBoundingClientRect(),
        target,
    }
}

export const IntersectionObserverMock = vi.fn(() => {
    return class FakeIntersectionObserver {
        private callback: (entries: IntersectionObserverEntry[]) => void
        private options?: IntersectionObserverInit

        constructor(
            callback: (entries: IntersectionObserverEntry[]) => void,
            options?: IntersectionObserverInit
        ) {
            this.callback = callback
            this.options = options
        }

        observe(element: Element) {
            setObservers(observers => [...observers, {
                source: this,
                target: element,
                callback: this.callback,
                options: this.options
            }])
        }

        disconnect() {
            setObservers(observers => observers.filter(observer => observer.source !== this))
        }

        unobserve(element: Element) {
            setObservers(observers => observers.filter(observer => observer.source !== element))
        }
    }
})


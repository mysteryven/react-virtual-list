import { DependencyList, useEffect, useMemo, useRef, useState } from "react";

interface Actions<T> {
    set: (newList: T[]) => void;
    update: (index: number, value: T) => void
}

export default function useList<T>(initialListFn: () => T[], deps: DependencyList): [T[], Actions<T>] {
    const listRef = useRef<T[]>(initialListFn())
    const saveInitialListFn = useRef<() => T[]>();
    const [_, forceUpdate] = useState<number>(0)

    useEffect(() => {
        saveInitialListFn.current = initialListFn
    })

    useEffect(() => {
        listRef.current = initialListFn();
        forceUpdate((count) => (count + 1) % 10e8)
    }, deps)

    const actions = useMemo(() => {
        return {
            set: (newList: T[]) => {
                listRef.current = newList
                forceUpdate((count) => (count + 1) % 10e8)
            },
            update(index: number, value: T) {
                listRef.current[index] = value
                forceUpdate((count) => (count + 1) % 10e8)
            },
        }
    }, [])


    return [listRef.current, actions]
}
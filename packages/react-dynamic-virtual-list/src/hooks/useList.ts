import { useMemo, useRef, useState } from "react";

interface Actions<T> {
    set: (newList: T[]) => void;
    update: (index: number, value: T) => void
}

export default function useList<T>(initialList: T[]): [T[], Actions<T>] {
    const listRef = useRef<T[]>(initialList)
    const [_, forceUpdate] = useState<number>(0)

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
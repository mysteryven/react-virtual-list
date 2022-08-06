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
                forceUpdate((count) => ++count)
            },
            update(index: number, value: T) {
                listRef.current[index] = value
                forceUpdate((count) => ++count)
            }
        }
    }, [])


    return [listRef.current, actions]
}
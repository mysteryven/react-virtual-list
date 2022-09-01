import { DependencyList, useEffect, useMemo, useRef, useState } from "react";

interface Actions<T> {
    set: (newList: T[]) => void;
    update: (index: number, value: T) => void
}

export default function useList<T>(initialListFn: () => T[], deps: DependencyList): [T[], Actions<T>] {
    const listRef = useRef<T[]>(initialListFn())
    const [_, forceUpdate] = useState<number>(0)

    const saveUpdate = () => forceUpdate((count) => (count + 1) % 10e8);
   
    useEffect(() => {
        listRef.current = initialListFn();
        saveUpdate() 
    }, deps)

    const actions = useMemo(() => {
        return {
            set: (newList: T[]) => {
                listRef.current = newList
                saveUpdate() 
            },
            update(index: number, value: T) {
                listRef.current[index] = value
                saveUpdate() 
            },
        }
    }, [])


    return [listRef.current, actions]
}
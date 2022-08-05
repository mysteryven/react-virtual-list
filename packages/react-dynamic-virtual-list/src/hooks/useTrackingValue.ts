import { useEffect, useRef } from "react";

export default function useTrackingValue<T>(value: T, onChange: (v: T) => void) {
    const prevValue = useRef<T>();

    useEffect(() => {
        prevValue.current = value
    })

    useEffect(() => {
        if (prevValue.current !== value) {
            onChange(value)
        }
    }, [value])
}
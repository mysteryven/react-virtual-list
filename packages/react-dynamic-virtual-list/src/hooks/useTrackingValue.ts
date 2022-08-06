import { useEffect, useRef } from "react";

export default function useTrackingValue<T>(value: T, onChange: (v: T) => void) {
    const tracked = useRef(value);
    const oldValue = tracked.current;
  
    useEffect(() => {
      if (value !== oldValue) {
        tracked.current = value;
        onChange(value);
      }
    }, [onChange, value, oldValue])
}
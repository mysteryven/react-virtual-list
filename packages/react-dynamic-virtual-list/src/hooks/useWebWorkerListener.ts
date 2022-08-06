import { useEffect, useRef } from "react";

type WorkCallback = ((this: Worker, ev: MessageEvent) => any) | null;

export default function useWebWorkerListener(worker: Worker, callback: WorkCallback ) {
    const saveCallback = useRef<WorkCallback>()

    useEffect(() => {
        saveCallback.current = callback
    }, [callback])

    useEffect(() => {
        function listener(this: Worker, ev: MessageEvent) {
            saveCallback.current?.call(this, ev)
        }

        worker.addEventListener('message', listener)

        return () => {
            worker.removeEventListener('message', listener)
        }
    }, [worker])
}
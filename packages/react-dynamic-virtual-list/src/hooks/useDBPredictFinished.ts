import { useEffect, useRef } from "react";
import DB from "../predictHeight/db";
import { Vector } from "../predictHeight/EM";

type Callback = (vector: number[]) => void

export default function useDBPredictFinished<T extends Vector>(
    db: DB,
    callback: Callback
) {
    const saveCallbackRef = useRef<Callback>();

    useEffect(() => {
        saveCallbackRef.current = callback
    })

    useEffect(() => {
        function listener(vector: number[]) {
            saveCallbackRef.current?.(vector)
        }

        db.addListener(listener);

        return () => {
            db.removeListener(listener);
        }
    }, [db])

}
import { useEffect, useRef } from "react";
import PredictDatabase from "../predictHeight/db";
import { Vector } from "../predictHeight/EM";

type Callback = (vector: number[]) => void

export default function useDBPredictFinished<T extends Vector>(
    db: PredictDatabase,
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
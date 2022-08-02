import { useEffect } from "react";
import DB from "../predictHeight/db";
import { Vector } from "../predictHeight/EM";

export default function useDBPredictFinished<T extends Vector>(
    db: DB,
    callback: (vector: number[]) => void
) {

    useEffect(() => {
        db.addListener(callback);

        return () => {
            db.removeListener(callback);
        }
    }, [db])

}
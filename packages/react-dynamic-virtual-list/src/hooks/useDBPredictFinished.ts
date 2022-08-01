import DB from "../predictHeight/db";
import { Vector } from "../predictHeight/EM";

export default function useDBPredictFinished<T extends Vector>(db: DB<T>, callback: (vector: T[]) => void) {

}
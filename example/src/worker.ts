import { exportWorker } from "use-worker-async";
import { beginPredict } from "../../src/predictHeight/worker";

exportWorker(beginPredict)
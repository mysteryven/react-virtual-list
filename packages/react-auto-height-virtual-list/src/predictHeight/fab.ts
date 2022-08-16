import { exportWorker } from "use-worker-like-request";

function fibonacci(n: number): number {
    if (n === 1) {
        return 1
    }

    if (n === 2) {
        return 2
    }

    return fibonacci(n - 1) + fibonacci(n - 2)
}

export default exportWorker(fibonacci);
/**
 * ** Expectation Maximization Algorithm (EM，期望最大化算法) **
 * 
 * 1. How to calculate the centroids
 *  
 * There are a Array of centroids, each centroid is a vector( [v[1], v[2], ... , v[n]] ). 
 * 
 * For a centroid, it vector is [w[1], w[2], ... , w[n]], in this group of vector：
 * w(i) = (v(1)(i) + v(2)(i) + ... + v(n)(i)) / n
 * 
 * 2. How to measure two points are close or not 
 * 
 * Assuming there are two points:  A(x1, x2, x3, ... , xn) and B(y1, y2, y3, ... , yn).
 * cosine(A, B) = (x1 * y1 + x2 * y2 + ... + xn * yn) / (||A|| * ||B||)
 * ||A|| = sqrt(x1^2 + x2^2 + ... + xn^2), ||B|| = sqrt(y1^2 + y2^2 + ... + yn^2)
 * 
 * A and B is all positive, so 0 <= cosine(A, B) <= 1
 * When cos close to 1, those two points are close, otherwise not.
 */

export type Vector = [number[], number];

export function begin(featureVectors: Vector[], centroidNum: number) {
    const initialCentroids = extractPartVectors(featureVectors, centroidNum);
    return calculateCentroids(featureVectors, initialCentroids)
}

export function calculateCentroids(featureVectors: Vector[], centroids: Vector[]) {
    let groups: Vector[][] = Array.from({ length: centroids.length }, () => [])

    for (let i = 0; i < featureVectors.length; i++) {
        const index = findNearestCentroidIndex(featureVectors[i], centroids)
        groups[index].push(featureVectors[i])
    }

    return groups
}

function findNearestCentroidIndex(point: Vector, centroids: Vector[]) {
    let minIndex = -1
    let minIndexCos = 0

    for (let i = 0; i < centroids.length; i++) {
        const cos = calculateCosine(point, centroids[i])
        if (cos > minIndexCos) {
            minIndex = i
            minIndexCos = cos
        }
    }

    return minIndex
}

const sqrtCache = new Map<string, number>();

export function calculateCosine(x: Vector, y: Vector) {
    const consOfTwoPoint = (x[0].reduce((acc, cur, index) => acc + cur * y[0][index], 0)) / (getSqrtOfVector(x) * getSqrtOfVector(y))
    return consOfTwoPoint
}

function getSqrtOfVector(vector: Vector) {
    const cacheKey = vector[0].join(',')
    if (sqrtCache.has(cacheKey)) {
        return sqrtCache.get(cacheKey)!
    }

    const ret = Math.sqrt(vector[0].reduce((acc, cur) => acc + cur * cur, 0))
    sqrtCache.set(cacheKey, ret)

    return ret
}

export function extractPartVectors(featureVectors: Vector[], size: number) {
    size = Math.max(1, Math.min(featureVectors.length, size))

    const uniqueIndices = new Set<number>()

    while (uniqueIndices.size < size) {
        const index = Math.floor(Math.random() * featureVectors.length)
        uniqueIndices.add(index)
    }

    return [...uniqueIndices].map(index => featureVectors[index])
}
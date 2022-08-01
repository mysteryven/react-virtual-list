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

export type Vector = number[];

export function beginIteration(
    featureVectors: Vector[],
    centroidNum: number,
    heightRecord: Record<string, number>
) {
    let centroids = extractPartVectors(featureVectors, centroidNum);

    for (let i = 0; i < 10; i++) {
        centroids = calculateCentroids(featureVectors, centroids)
    }

    const centroidsHeight: number[] = [];

    let indexOfGroup: number[][] = Array.from({ length: centroids.length }, () => [])

    for (let i = 0; i < featureVectors.length; i++) {
        const index = findNearestCentroidIndex(featureVectors[i], centroids)
        indexOfGroup[index].push(i)
    }

    for (let i = 0; i < indexOfGroup.length; i++) {
        const aGroup = indexOfGroup[i]
        let height = 0

        for (let i = 0; i < aGroup.length; i++) {
            const cacheKey = featureVectors[aGroup[i]].join("-")
            height += (heightRecord[cacheKey] || 0)
        }


        centroidsHeight[i] = height / aGroup.length
    }

    return centroids
}

export function calculateCentroids(featureVectors: Vector[], centroids: Vector[]) {
    let groups = groupByCentroids(featureVectors, centroids)

    const newCentroids = []
    for (let i = 0; i < groups.length; i++) {
        newCentroids.push(calculateCenterPoint(groups[i]))
    }

    return newCentroids
}

export function groupByCentroids(featureVectors: Vector[], centroids: Vector[]) {
    let groups: Vector[][] = Array.from({ length: centroids.length }, () => [])

    for (let i = 0; i < featureVectors.length; i++) {
        const index = findNearestCentroidIndex(featureVectors[i], centroids)
        groups[index].push(featureVectors[i])
    }

    return groups.filter(i => i.length !== 0);
}

export function calculateCenterPoint(featureVectors: Vector[]) {
    if (featureVectors.length === 0) {
        return []
    }

    let centerPoint = new Array(featureVectors[0].length).fill(0)
    for (let i = 0; i < featureVectors.length; i++) {
        for (let j = 0; j < featureVectors[i].length; j++) {
            centerPoint[j] += featureVectors[i][j]
        }
    }

    return centerPoint.map(i => i / featureVectors.length)
}

export function findNearestCentroidIndex(point: Vector, centroids: Vector[]) {
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
    const consOfTwoPoint = (x.reduce((acc, cur, index) => acc + cur * y[index], 0)) / (getSqrtOfVector(x) * getSqrtOfVector(y))
    return consOfTwoPoint
}

function getSqrtOfVector(vector: Vector) {
    const cacheKey = vector.join(',')
    if (sqrtCache.has(cacheKey)) {
        return sqrtCache.get(cacheKey)!
    }

    const ret = Math.sqrt(vector.reduce((acc, cur) => acc + cur * cur, 0))
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
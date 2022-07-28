type Vector = [number[], number];

// Expectation Maximization Algorithm (EM，期望最大化算法)
/**
 * 
 * 1. How to calculate the centroids
 *
 *  
 * There are a Array of centroids, each centroid is a vector( [v[1], v[2], ... , v[n]] ). 
 * 
 * For a centroid, it vector is [w[1], w[2], ... , w[n]], in this group of vector：
 * w(i) = (v(1)(i) + v(2)(i) + ... + v(n)(i)) / n
 * 
 * 2. How to measure two points are close or not 
 * 
 * Assuming there are two point:  A(x1, x2, x3, ... , xn) and B(y1, y2, y3, ... , yn).
 * cosine(A, B) = (x1 * y1 + x2 * y2 + ... + xn * yn) / (||A|| * ||B||)
 * ||A|| = sqrt(x1^2 + x2^2 + ... + xn^2), ||B|| = sqrt(y1^2 + y2^2 + ... + yn^2)
 * 
 * A and B is all positive, so 0 <= cosine(A, B) <= 1
 * When cos close to 1, those two points are close, otherwise not.
 */
class EM {
    async calculateCentroids(centroidNum: number, featureVectors: Vector[]) {


    }
}
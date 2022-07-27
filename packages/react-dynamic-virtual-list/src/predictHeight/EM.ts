type Vector = [number[], number];

// Expectation Maximization Algorithm (EM，期望最大化算法)
/**
 * **理论基础**
 * 
 * 1. 如何计算计算出中心点
 * 
 * 记一个中心点为[w[1], w[2], ... , w[n]]，其中：
 * w(i) = (v(1)(i) + v(2)(i) + ... + v(n)(i)) / n
 * 
 * 2. 如何衡量两个中心点足够近
 * 
 * 假设点 A(x1, x2, x3, ... , xn) 和 B(y1, y2, y3, ... , yn)
 * cosine(A, B) = (x1 * y1 + x2 * y2 + ... + xn * yn) / (||A|| * ||B||)
 * ||A|| = sqrt(x1^2 + x2^2 + ... + xn^2), ||B|| = sqrt(y1^2 + y2^2 + ... + yn^2)
 * 
 * 两个变量的取值都是正数，所以 0<= cosine(A, B) <=1
 * 当 cos 值接近 1 时，两个值特别相似；接近 0 时，两个值特别不相似
 */
class EM {
    async calculateCentroids(centroidNum: number, featureVectors: Vector[]) {
        const centroids = []

    }
}
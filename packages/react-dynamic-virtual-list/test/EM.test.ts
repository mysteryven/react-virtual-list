import { beforeEach, describe, expect, it, test } from 'vitest'
import { begin, calculateCentroids, calculateCosine, extractPartVectors, findNearestCentroidIndex, Vector } from '../src/predictHeight/EM'


function generatorVectorsAroundOf(aroundPoint: Vector, range: number, num: number) {
    const ret: Vector[] = []

    for (let i = 0; i < num; i++) {
        let nextPoint: Vector = [[], 0]
        aroundPoint[0].forEach(feature => {
            const addOrMinusWeight = (Math.random() > 0.5 ? 1 : -1) * range * Math.random()
            nextPoint[0].push(feature + addOrMinusWeight)
        })
        ret.push(nextPoint)
    }

    return ret
}

// describe("EM", () => {
//     const initialFeatures: Vector[] = [
//         [[1, 1], 0],
//         [[2, 2], 0]
//     ];

//     let mockFeatures: Vector[] = [
//         [[1, 1], 0],
//         [[2, 2], 0]
//     ]

//     for (let feature of initialFeatures) {
//         const temp = generatorVectorsAroundOf(feature, 0.1, 4)
//         mockFeatures = mockFeatures.concat(temp)
//     }

//     it('group vectors rightly', () => {
//         console.log(mockFeatures)
//         const ans = begin(mockFeatures, 2)

//         expect(1).toBe(1)
//     })
// })

function generatorRandomVectors(num: number, vectorSize: number) {
    let ret: Vector[] = []
    for (let i = 0; i < num; i++) {
        let aVector = []

        for (let j = 0; j < vectorSize; j++) {
            aVector.push(Math.random())
        }
        ret.push([aVector, Math.random()])
    }
    return ret
}

describe('findNearestCentroidIndex', () => {
    const basePoint1 = [1, 1]
    const basePoint2 = [2, 2]
    const initialFeatures: Vector[] = [
        [basePoint1, 0],
        [basePoint2, 0]
    ];

    let mockFeatures: Vector[] = [
        [basePoint1, 0],
        [basePoint2, 0]
    ]

    const error = 0.1

    for (let feature of initialFeatures) {
        const temp = generatorVectorsAroundOf(feature, 0.1, 4)
        mockFeatures = mockFeatures.concat(temp)
    }

    const nearestIndex = findNearestCentroidIndex([[1, 1], 0], mockFeatures)
    
    const isOutOfError = false
    feature
})

describe('calculateCosine', () => {
    it('should return 0 when angle is 90°', () => {
        expect(calculateCosine([[0, 1], 0], [[1, 0], 0])).toBe(0)
        expect(calculateCosine([[0, 100], 0], [[1, 0], 0])).toBe(0)
    })

    it('should return 1 when angle is 0°', () => {
        expect(calculateCosine([[0, 1], 0], [[0, 1], 0])).toBe(1)
        expect(calculateCosine([[0, 100], 0], [[0, 1], 0])).toBe(1)
    })

    it('should return 0.5 when angle is 60°', () => {
        expect((calculateCosine([[1, 0], 0], [[1, Math.sqrt(3)], 0]).toFixed(1))).toBe('0.5')
    })
})

describe('getRandomVectors', () => {
    let vectors: Vector[] = []

    beforeEach(() => {
        vectors = generatorRandomVectors(100, 10)
    })


    it('should return correct size', () => {
        expect(extractPartVectors(vectors, 10).length).equal(10)
    })

    it('should has shape of vector', () => {
        const extractedVectors = extractPartVectors(vectors, 1);

        for (let v of extractedVectors) {
            expect(v.length).equal(2)
            expect(Array.isArray(v[0])).equal(true)
            expect(typeof v[1]).equal('number')
        }
    })

    it('should use 1 if size smaller than 1', () => {
        expect(extractPartVectors(vectors, -1).length).equal(1)
    })

    it('should use vectors.size if size bigger than vectors.size', () => {
        expect(extractPartVectors(vectors, vectors.length + 1).length).equal(vectors.length)
    })
})

test('calculateCentroids', () => {
    const featureVectors = [
        [1, 1],
    ]
});
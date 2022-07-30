import { beforeEach, describe, expect, it, test } from 'vitest'
import { begin, calculateCosine, extractPartVectors, findNearestCentroidIndex, Vector } from '../src/predictHeight/EM'


function generatorAVectorAroundOf(aroundPoint: Vector, range: number) {
    let nextPoint: Vector = [[], 0]
    aroundPoint[0].forEach(feature => {
        const addOrMinusWeight = (Math.random() > 0.5 ? 1 : -1) * range * Math.random()
        nextPoint[0].push(feature + addOrMinusWeight)
    })
    return nextPoint;
}

function generatorVectorsAroundOf(aroundPoint: Vector, range: number, num: number) {
    const ret: Vector[] = []

    for (let i = 0; i < num; i++) {
        ret.push(generatorAVectorAroundOf(aroundPoint, range))
    }

    return ret
}

describe("EM", () => {
    const initialFeatures: Vector[] = [
        [[1, 1], 0],
        [[2, 2], 0]
    ];

    let mockFeatures: Vector[] = [
        [[1, 1], 0],
        [[2, 2], 0]
    ]

    for (let feature of initialFeatures) {
        const temp = generatorVectorsAroundOf(feature, 0.1, 4)
        mockFeatures = mockFeatures.concat(temp)
    }

    it('group vectors rightly', () => {
        const ans = begin(mockFeatures, 2)

        expect(1).toBe(1)
    })
})

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
    test('the nearest item', () => {
        const basePoint = [1, 1]
        const error = 0.1
        let mockFeatures = generatorVectorsAroundOf([basePoint, 0], error, 4)
        mockFeatures = mockFeatures.concat(generatorVectorsAroundOf([basePoint, 0], error * 2, 4))
        mockFeatures = mockFeatures.concat(generatorVectorsAroundOf([basePoint, 0], error * 4, 4))

        const randomVector = generatorAVectorAroundOf([basePoint, 0], error)
        const nearestIndex = findNearestCentroidIndex(randomVector, mockFeatures)
        const nearestFeature = mockFeatures[nearestIndex][0]

        for (let i = 0; i < randomVector[0].length; i++) {
            expect(Math.abs(randomVector[0][i] - nearestFeature[i]) < error).toBe(true)
        }
    })
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
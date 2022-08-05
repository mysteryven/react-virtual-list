import { beforeEach, describe, expect, it, test } from 'vitest'
import { beginIteration, calculateCenterPoint, calculateCentroids, calculateCosine, extractPartVectors, findNearestCentroidIndex, groupByCentroids, Vector } from '../src/predictHeight/EM'
import { generatorRandomVectors, generatorVectorsAroundOf } from './testHelper';

describe('findNearestCentroidIndex', () => {
    test('the nearest item', () => {
        const basePoint = [1, 1]
        let mockFeatures = [
            [2, 2.011],
            [2, 2.111],
            [3, 3.1123]
        ]

        const nearestIndex = findNearestCentroidIndex(basePoint, mockFeatures)
        const nearestFeature = mockFeatures[nearestIndex]

        for (let i = 0; i < basePoint.length; i++) {
            expect(nearestFeature).toStrictEqual([2, 2.011])
        }
    })
})

describe('calculateCosine', () => {
    it('should return 0 when angle is 90°', () => {
        expect(calculateCosine([0, 1], [1, 0])).toBe(0)
        expect(calculateCosine([0, 100], [1, 0])).toBe(0)
    })

    it('should return 1 when angle is 0°', () => {
        expect(calculateCosine([0, 1], [0, 1])).toBe(1)
        expect(calculateCosine([0, 100], [0, 1])).toBe(1)
    })

    it('should return 0.5 when angle is 60°', () => {
        expect((calculateCosine([1, 0], [1, Math.sqrt(3)]).toFixed(1))).toBe('0.5')
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
            expect(Array.isArray(v)).equal(true)
        }
    })

    it('should use 1 if size smaller than 1', () => {
        expect(extractPartVectors(vectors, -1).length).equal(1)
    })

    it('should use vectors.size if size bigger than vectors.size', () => {
        expect(extractPartVectors(vectors, vectors.length + 1).length).equal(vectors.length)
    })
})

describe('calculateCentroids', () => {
    test('it get right group', () => {

        const myFeatureVectors: Vector[] = [
            [1, 1], [1, 1.11], [1, 1.111], [1, 1.01], [1, 1.1111],
            [2, 4], [2, 4.1], [2, 4.12], [2, 4.123], [2, 4.123123]
        ]

        const centroidsNum = 2

        const initialCentroids = extractPartVectors(myFeatureVectors, centroidsNum);

        let newCentroids: Vector[] = []
        newCentroids = calculateCentroids(myFeatureVectors, initialCentroids)
        for (let i = 0; i < 10; i++) {
            calculateCentroids(myFeatureVectors, newCentroids)
        }

        const ret = groupByCentroids(myFeatureVectors, newCentroids)

        const wrapper = {
            ret
        };

        expect(wrapper).toEqual({
            ret: expect.arrayContaining([
                [
                    [1, 1],
                    [1, 1.11],
                    [1, 1.111],
                    [1, 1.01],
                    [1, 1.1111],
                ],
                [
                    [2, 4],
                    [2, 4.1],
                    [2, 4.12],
                    [2, 4.123],
                    [2, 4.123123],
                ]
            ])
        })
    })
});

test('calculateCenterPoint', () => {
    expect(calculateCenterPoint([
        [1, 1],
        [3, 3]
    ])).toStrictEqual([2, 2])
})

test('beginIteration', () => {
    const myFeatureVectors: Vector[] = [
        [1, 1], [1, 1.11], [1, 1.111], [1, 1.01], [1, 1.1111],
        [2, 4], [2, 4.1], [2, 4.12], [2, 4.123], [2, 4.123123]
    ]

    expect(beginIteration(myFeatureVectors, 2, {}).centroids.length).toEqual(2)
})
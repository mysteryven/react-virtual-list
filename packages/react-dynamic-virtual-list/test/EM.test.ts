import exp from 'constants'
import { beforeEach, expect, it, test } from 'vitest'
import { extractPartVectors, Vector } from '../src/predictHeight/EM'

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

test('getRandomVectors', () => {
    let vectors: Vector[] = [] 

    beforeEach(() => {
        vectors = generatorRandomVectors(100, 10)
    })


    it('should return correct size', () => {
        expect(extractPartVectors(vectors, 10).length).equal(10)
    })

    it('should has shape of vector', () => {
        const extractedVectors = extractPartVectors(vectors, 1);

        for(let v of extractedVectors) {
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
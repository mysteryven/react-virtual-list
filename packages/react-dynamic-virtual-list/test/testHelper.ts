import { Vector } from "../src/predictHeight/EM";

export function generatorAVectorAroundOf(aroundPoint: Vector, range: number) {
    let nextPoint: Vector = [[], 0]
    aroundPoint[0].forEach(feature => {
        const addOrMinusWeight = (Math.random() > 0.5 ? 1 : -1) * range * Math.random()
        nextPoint[0].push(feature + addOrMinusWeight)
    })
    return nextPoint;
}

export function generatorVectorsAroundOf(aroundPoint: Vector, range: number, num: number) {
    const ret: Vector[] = []

    for (let i = 0; i < num; i++) {
        ret.push(generatorAVectorAroundOf(aroundPoint, range))
    }

    return ret
}

export function generatorRandomVectors(num: number, vectorSize: number) {
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

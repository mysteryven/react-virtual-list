import { describe, test, expect } from "vitest";
import { groupArray } from "../src/utils";

function generatorArray(len: number) {
    return Array.from({ length: len }, (_, i) => i)
}

describe('groupArray', () => {
    test('when array length is odd', () => {
        const arr = generatorArray(9)

        expect(groupArray(arr, 3)).toStrictEqual(
            [
                [0, 1, 2],
                [3, 4, 5],
                [6, 7, 8],
            ]
        )

        expect(groupArray(arr, 4)).toStrictEqual(
            [
                [0, 1, 2],
                [3, 4],
                [5, 6],
                [7, 8],
            ]
        )

        const result1 = groupArray(arr, 12);
        expect(result1.length).toBe(arr.length);
        expect(result1.flat(1)).toStrictEqual(arr);

        const result2 = groupArray(arr, -1);
        expect(result2.length).toBe(1);
        expect(result2.flat(1)).toStrictEqual(arr);
    })


    test('when array length is even', () => {
        const arr = generatorArray(20)

        const result1 = groupArray(arr, -1);
        expect(result1.length).toBe(1);
        expect(result1.flat(1)).toStrictEqual(arr);

        const result2 = groupArray(arr, 9);
        expect(result2.length).toBe(9);
        expect(result2.flat(1)).toStrictEqual(arr);


        const result3 = groupArray(arr, 10);
        expect(result3.length).toBe(10);
        expect(result3.flat(1)).toStrictEqual(arr);


        const result4 = groupArray(arr, 11);
        expect(result4.length).toBe(11);
        expect(result4.flat(1)).toStrictEqual(arr);


        const result5 = groupArray(arr, 21);
        expect(result5.length).toBe(20);
        expect(result5.flat(1)).toStrictEqual(arr);
    })
})
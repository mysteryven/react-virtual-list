import { HeightItem } from "../interface"
import { beginIteration, findNearestCentroidIndex, Vector } from "./EM"

self.onmessage = ({data}) => {
    const newHeights = beginPredict(
        data.allList,
        data.itemToHeightMap,
        data.itemCount,
        data.factors,
        data.heights
    )

    self.postMessage(newHeights)
}

export function beginPredict(
    allList: Vector[],
    itemToHeightMap: Record<string, number>,
    itemCount: number,
    factors: Vector[],
    heights: HeightItem[]
) {
    const { centroids, centroidsHeight } = beginIteration(allList, itemCount, itemToHeightMap)
    const predictHeights: number[] = []

    factors.forEach(item => {
        const nearestIndex = findNearestCentroidIndex(item, centroids)
        predictHeights.push(centroidsHeight[nearestIndex])
    })

    const newHeights = [...heights]

    predictHeights.forEach((predictHeight, index) => {
        if (newHeights[index].type !== 'real') {
            newHeights[index] = {
                type: 'predict',
                value: predictHeight
            }
        }
    })

    return newHeights
}

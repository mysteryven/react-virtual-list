import { beginIteration, findNearestCentroidIndex, Vector } from "./EM"

export enum PredictDatabaseStatus {
    empty,
    collecting,
    computing,
    finished
}

export default class PredictDatabase {
    weight: Map<keyof Vector, number> = new Map()
    // {a: number, b: string}
    allList: Vector[] = []
    itemToHeightMap: Record<string, number> = {}
    DBStatus: PredictDatabaseStatus = PredictDatabaseStatus.empty
    waitToPredictList: Vector[] = []
    listeners: ((heights: number[]) => void)[] = []

    constructor() { }

    initWeight(weight: Map<keyof Vector, number>) {
        this.weight = weight
    }

    restoreFromCache() {
        const cache = window.localStorage.getItem('x');
        const cache2 = window.localStorage.getItem('y')
        if (!cache || !cache2) {
            return
        }

        this.allList = JSON.parse(cache)
        this.itemToHeightMap = JSON.parse(cache2)
    }

    initWaitToPredictList(list: Vector[]) {
        this.waitToPredictList = list
    }

    addListener(callback: (heights: number[]) => void) {
        this.listeners.push(callback)
    }

    removeListener(callback: (heights: number[]) => void) {
        this.listeners = this.listeners.filter(item => item !== callback)
    }

    isReadyToPredict() {
        if (this.allList.length < 10000) {
            return false
        }

        return true
    }

    addToListLib(index: number, height: number) {
        if (this.DBStatus === PredictDatabaseStatus.computing) {
            return
        }

        if (this.DBStatus === PredictDatabaseStatus.finished) {
            return
        }

        if (this.waitToPredictList.length === 0) {
            return
        }

        const item = this.waitToPredictList[index];
        this.itemToHeightMap[item.join('-')] = height
        this.allList.push(item)

        window.localStorage.setItem('x', JSON.stringify(this.allList))
        window.localStorage.setItem('y', JSON.stringify(this.itemToHeightMap))

        if (this.isReadyToPredict()) {
            this.DBStatus = PredictDatabaseStatus.finished
            const { centroids, centroidsHeight } = beginIteration(this.allList, 200, this.itemToHeightMap)

            const heights = this.predict(centroids, centroidsHeight) 

            this.listeners.forEach(listener => {
                listener(heights)
            })
        }
    }

    predict(centroids: Vector[], centroidsHeight: number[]) {
        const heights: number[] = []
        this.waitToPredictList.forEach(item => {
            const nearestIndex = findNearestCentroidIndex(item, centroids)
            heights.push(centroidsHeight[nearestIndex])
        })

        return heights;
    }

    getList(): Vector[] {
        return []
    }
}

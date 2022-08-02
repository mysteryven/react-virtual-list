import { beginIteration, findNearestCentroidIndex, Vector } from "./EM"

export enum DBStatus {
    empty,
    collecting,
    computing,
    finished
}

export default class DB {
    weight: Map<keyof Vector, number> = new Map()
    // {a: number, b: string}
    allList: Vector[] = []
    itemToHeightMap: Record<string, number> = {}
    DBStatus: DBStatus = DBStatus.empty
    waitToPredictList: Vector[] = []
    listeners: ((heights: number[]) => void)[] = []

    constructor() { }

    initWeight(weight: Map<keyof Vector, number>) {
        this.weight = weight
    }

    restoreFromCache() {
        const cache = window.localStorage.getItem('xxx');
        if (!cache) {
            return
        }

        this.allList = JSON.parse(cache)
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
        if (this.allList.length < 100) {
            return false
        }

        return true
    }

    addToListLib(index: number, height: number) {
        if (this.DBStatus === DBStatus.computing) {
            // console.warn('not need add any more.')
            return
        }

        if (this.DBStatus === DBStatus.finished) {
            // console.warn('has finished compute.')
            return
        }

        if (this.waitToPredictList.length === 0) {
            console.warn('you should call initWaitToPredictList first before addToListLib')
            return false
        }

        // [100, 2]
        const item = this.waitToPredictList[index];
        this.itemToHeightMap[item.join('-')] = height

        this.allList.push(item)

        // window.localStorage.setItem('xxx', JSON.stringify(this.allList))

        if (this.isReadyToPredict()) {
            console.log('has read to predict')
            this.DBStatus = DBStatus.finished
            const { centroids, centroidsHeight } = beginIteration(this.allList, 10, this.itemToHeightMap)

            console.log(centroidsHeight, '--')
            const heights = this.predict(centroids, centroidsHeight) 

            console.log('real-heights', this.itemToHeightMap)
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

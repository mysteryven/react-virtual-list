import { beginIteration, Vector } from "./EM"

export enum DBStatus {
    empty,
    collecting,
    computing,
    finished
}

export default class DB<T extends Vector> {
    weight: Map<keyof T, number> = new Map()
    // {a: number, b: string}
    allList: T[] = []
    itemToHeightMap: Record<string, number> = {}
    DBStatus: DBStatus = DBStatus.empty
    waitToPredictList: T[] = []

    constructor() { }

    initWeight(weight: Map<keyof T, number>) {
        this.weight = weight
    }

    restoreFromCache() {
        const cache = window.localStorage.getItem('xxx');
        if (!cache) {
            return
        }

        this.allList = JSON.parse(cache)
    }

    initWaitToPredictList(list: T[]) {
        this.waitToPredictList = list
    }

    isReadyToPredict() {
        if (this.allList.length < 1000) {
            return false
        }

        return true
    }

    addToListLib(index: number, height: number) {
        if (this.DBStatus === DBStatus.computing) {
            console.warn('not need add any more.')
            return
        }

        if (this.DBStatus === DBStatus.finished) {
            console.warn('has finished compute.')
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

        window.localStorage.setItem('xxx', JSON.stringify(this.allList))

        if (this.isReadyToPredict()) {
            console.log('has read to predict')
            this.DBStatus = DBStatus.finished
            console.log(beginIteration(this.allList, 10, {}))
        }
    }

    getList(): T[] {
        return []
    }
}

import { findNearestCentroidIndex, Vector } from "./EM"
import { DBSchema, IDBPDatabase, openDB } from 'idb/with-async-ittr';

export enum PredictDatabaseStatus {
    empty,
    collecting,
    computing,
    finished,
}

interface PredictHeightDB extends DBSchema {
    'dynamic-height-list': {
        value: {
            weight: Vector;
            height: number;
        };
        key: string;
    };
}

type ListenerCallbackType = (allList: Vector[], itemToHeightMap: Record<string, number>) => void;

export default class PredictDatabase {
    weight: Map<keyof Vector, number> = new Map()
    DBStatus: PredictDatabaseStatus = PredictDatabaseStatus.empty
    waitToPredictList: Vector[] = []
    listeners: ((allList: Vector[], itemToHeightMap: Record<string, number>) => void)[] = []
    db: IDBPDatabase<PredictHeightDB> | null = null
    capacity: number = 1000

    constructor(capacity: number) {
        this.capacity = capacity
    }

    async initDB() {
        this.db = await openDB<PredictHeightDB>('dynamic-virtual-list', 1, {
            upgrade(db) {
                db.createObjectStore('dynamic-height-list', {
                    keyPath: 'id',
                    autoIncrement: true,
                });
            },
        });
    }

    initWeight(weight: Map<keyof Vector, number>) {
        this.weight = weight
    }

    restoreFromCache() {
    }

    initWaitToPredictList(list: Vector[]) {
        this.waitToPredictList = list
    }

    clearAllData() {
        this.db?.clear('dynamic-height-list')
    }

    addListener(callback: ListenerCallbackType) {
        this.listeners.push(callback)
    }

    removeListener(callback: ListenerCallbackType) {
        this.listeners = this.listeners.filter(item => item !== callback)
    }

    async isReadyToPredict() {
        const count = await this.db?.count("dynamic-height-list")
        if (count && count >= this.capacity) {
            return false
        }

        return true
    }

    async addSample(index: number, height: number) {
        if (this.waitToPredictList.length === 0 || !this.waitToPredictList[index]) {
            return
        }

        const item = this.waitToPredictList[index];

        if (!this.db) {
            await this.initDB()
        }

        this.db?.put('dynamic-height-list', {
            weight: item,
            height
        })

        if (await this.isReadyToPredict()) {
            if (this.DBStatus === PredictDatabaseStatus.finished) {
                return
            }

            this.DBStatus = PredictDatabaseStatus.finished
            const source = await this.db?.getAll('dynamic-height-list') || []
            let allList: Vector[] = []
            let itemToHeightMap: Record<string, number> = {} 

            source.forEach(item => {
                allList.push(item.weight)
                itemToHeightMap[item.weight.join("-")] = item.height
            })
            this.listeners.forEach(listener => {
                listener(allList, itemToHeightMap)
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
}

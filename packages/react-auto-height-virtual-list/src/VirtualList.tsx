import { useCallback, useEffect, useRef, useState } from "react";
import { useMemo } from "react"
import useIdleCallback from "./hooks/useIdleCallback";
import useIntersection from "./hooks/useIntersection";
import { HeightItem, ItemRendererProps, ListObserverProps, UnsupportedBehavior, VirtualListProps } from "./interface";
import { groupArray } from "./utils";
import PredictDatabase from './predictHeight/db'
import useDBPredictFinished from "./hooks/useDBPredictFinished";
import useTrackingValue from "./hooks/useTrackingValue";
import useList from "./hooks/useList";
import PredictWorker from './predictHeight/worker?worker&inline'
import FabWorker from './predictHeight/fab?worker&inline'
import useWorker from 'use-worker-like-request'
import useWebWorkerListener from "./hooks/useWebWorkerListener";

const createWorker = () => new FabWorker()

const worker = new PredictWorker()

const VIRTUAL_LIST_VERSION_KEY = 'react-dynamic-list-version-cache-key'

const VirtualList = (props: VirtualListProps) => {
    const {
        itemCount,
        dividedAreaNum = 10,
        factors = [],
        itemHeight: itemMinHeight,
        useDynamicHeight = false,
        version = 0
    } = props

    const db = useMemo(() => {
        return new PredictDatabase(itemCount * 20);
    }, [])

    const {workerRunner}  = useWorker(createWorker)

    useEffect(() => {
        setTimeout(() => {
            workerRunner(10)
        }, 4000)
    }, [])

    const groupList = useMemo(() => {
        const arr = Array.from({ length: itemCount }, (_, index) => index)
        return groupArray(arr, dividedAreaNum)
    }, [itemCount, dividedAreaNum])

    const [heights, actions] = useList<HeightItem>(
        () => Array.from({ length: itemCount }, () => ({ type: 'default', value: itemMinHeight })),
        [itemCount, itemMinHeight]
    );

    useEffect(() => {
        let previousVersion = 0
        try {
            previousVersion = JSON.parse(localStorage.getItem(VIRTUAL_LIST_VERSION_KEY) || '0')
            if (previousVersion !== version) {
                db.clearAllData()
            }
        } catch(e) {
            console.error(e)
        } 
    }, [version])

    useWebWorkerListener(worker, ({ data }) => {
        if (Array.isArray(data) && data.length === heights.length) {
            console.log("has predict")
            actions.set(data)
        }
    })

    useEffect(() => {
        if (useDynamicHeight && Array.isArray(factors) && factors.length === itemCount) {
            db.initWaitToPredictList(factors)
        }
    }, [factors])

    useDBPredictFinished(db, async (allList, itemToHeightMap) => {
        if (!useDynamicHeight) {
            return
        }
        worker.postMessage({
            allList,
            itemToHeightMap,
            itemCount,
            factors,
            heights,
        })
    })

    function handleItemHeightChange(index: number, height: number) {
        actions.update(index, {
            type: 'real',
            value: height
        })
    }

    return (
        <>
            {
                groupList.map((item, index) => (
                    <ListObserver key={index}
                        db={db}
                        useDynamicHeight={useDynamicHeight}
                        dividedAreaNum={dividedAreaNum}
                        indexList={item}
                        heights={heights}
                        isObserving={true}
                        children={props.children}
                        onItemHeightChange={handleItemHeightChange}
                    />
                ))
            }
        </>
    )
}

export const ListObserver = (props: ListObserverProps) => {
    const { indexList, children, dividedAreaNum, isObserving, heights } = props
    const ref = useRef<HTMLDivElement>(null)

    const groupedList = useMemo(() => {
        return groupArray(indexList, dividedAreaNum)
    }, [indexList, dividedAreaNum])

    // The fourth param is only used to tell unit test current observing area.
    // @ts-ignore 
    const intersectionObserverEntry = useIntersection(ref, { threshold: 0 }, isObserving, `${indexList[0]}-${indexList[indexList.length - 1]}`)

    let minHeight = indexList.reduce((prev, cur) => prev + (heights[cur]?.value || 0), 0)

    function handleItemHeightChange(index: number, height: number) {
        if (heights[index].value === height || !props.useDynamicHeight) {
            return
        }

        props.onItemHeightChange?.(index, height)
    }

    return (
        <div ref={ref} role="list" style={{ minHeight }}>
            {
                intersectionObserverEntry && intersectionObserverEntry.isIntersecting ?
                    <>
                        {
                            groupedList.map((subGroupedList, index) => {
                                if (subGroupedList.length === 1) {
                                    return (
                                        <ItemRenderer
                                            db={props.db}
                                            onItemHeightChange={handleItemHeightChange}
                                            key={index}
                                            index={subGroupedList[0]}
                                            children={props.children}
                                        />
                                    )
                                } else {
                                    return (
                                        <ListObserver
                                            db={props.db}
                                            onItemHeightChange={props.onItemHeightChange}
                                            key={index}
                                            indexList={subGroupedList}
                                            children={children}
                                            useDynamicHeight={props.useDynamicHeight}
                                            dividedAreaNum={dividedAreaNum}
                                            heights={heights}
                                            isObserving={intersectionObserverEntry.isIntersecting}
                                        />
                                    )
                                }
                            })
                        }
                    </>
                    : null
            }
        </div>
    )
}

export const ItemRenderer = (props: ItemRendererProps) => {
    const [height, setHeight] = useState<number>(0);

    const measuredRef = useCallback((node: HTMLDivElement) => {
        if (node !== null) {
            setHeight(node.getBoundingClientRect().height);
        }
    }, []);

    useIdleCallback(() => {
        if (height > 0) {
            props.db?.addSample(props.index, height)
        }
    }, undefined, UnsupportedBehavior.immediate)

    useTrackingValue(height, (newHeight) => {
        props.onItemHeightChange?.(props.index, newHeight)
    })

    return (
        <div role="item" data-height={height} ref={measuredRef}>
            {props.children({ index: props.index })}
        </div>
    )
}

export default VirtualList

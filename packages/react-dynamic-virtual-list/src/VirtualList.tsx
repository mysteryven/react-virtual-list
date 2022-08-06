import { useCallback, useEffect, useRef, useState } from "react";
import { useMemo } from "react"
import useIdleCallback from "./hooks/useIdleCallback";
import useIntersection from "./hooks/useIntersection";
import { HeightItem, ItemRendererProps, ListObserverProps, UnsupportedBehavior, VirtualListProps } from "./interface";
import { groupArray } from "./utils";
import DB from './predictHeight/db'
import useDBPredictFinished from "./hooks/useDBPredictFinished";
import useTrackingValue from "./hooks/useTrackingValue";
import useList from "./hooks/useList";

// @ts-ignore
// requestIdleCallback = null

const db = new DB();
(window as any).db = db;

const VirtualList = (props: VirtualListProps) => {
    const { itemCount, dividedAreaNum, factors, itemMinHeight } = props

    const groupList = useMemo(() => {
        const arr = Array.from({ length: itemCount }, (_, index) => index)
        return groupArray(arr, dividedAreaNum)
    }, [itemCount, dividedAreaNum])

    const [heights, actions] = useList<HeightItem>(
        Array.from({ length: itemCount }, () => ({ type: 'default', value: itemMinHeight }))
    );

    useEffect(() => {
        db.initWaitToPredictList(factors || [])
        db.restoreFromCache()
    }, [factors])

    useDBPredictFinished(db, (predictHeights) => {
        const newHeights = [...heights]

        predictHeights.forEach((predictHeight, index) => {
            if (newHeights[index].type !== 'real') {
                newHeights[index] = {
                    type: 'predict',
                    value: predictHeight
                }
            }
        })

        actions.set(newHeights)
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
                        dividedAreaNum={props.dividedAreaNum}
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
    const prevMinHeight = useRef<number>();

    const groupedList = useMemo(() => {
        return groupArray(indexList, dividedAreaNum)
    }, [indexList, dividedAreaNum])

    // The fourth param is only used to tell unit test current observing area.
    // @ts-ignore 
    const intersectionObserverEntry = useIntersection(ref, { threshold: 0 }, isObserving, `${indexList[0]}-${indexList[indexList.length - 1]}`)

    const minHeight = indexList.reduce((prev, cur) => prev + heights[cur].value, 0)

    useEffect(() => {
        prevMinHeight.current = minHeight
    })

    function handleItemHeightChange(index: number, height: number) {
        if (heights[index].value === height) {
            return
        }

        props.onItemHeightChange(index, height)
    }

    // if (minHeight !== prevMinHeight.current) {
    //     console.log('height update', `${indexList[0]}-${indexList[indexList.length - 1]}`, prevMinHeight, minHeight)
    // } else {
    //     console.log('height update but same', `${indexList[0]}-${indexList[indexList.length - 1]}`, prevMinHeight, minHeight, heights)
    // }


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
                                            onItemHeightChange={handleItemHeightChange}
                                            key={index}
                                            index={subGroupedList[0]}
                                            children={props.children}
                                        />
                                    )
                                } else {
                                    return (
                                        <ListObserver
                                            onItemHeightChange={props.onItemHeightChange}
                                            key={index}
                                            indexList={subGroupedList}
                                            children={children}
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
            db.addToListLib(props.index, height)
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

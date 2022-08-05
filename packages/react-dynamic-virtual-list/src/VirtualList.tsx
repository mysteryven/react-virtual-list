import { useCallback, useEffect, useRef, useState } from "react";
import { useMemo } from "react"
import useIdleCallback from "./hooks/useIdleCallback";
import useIntersection from "./hooks/useIntersection";
import { ItemRendererProps, ListObserverProps, UnsupportedBehavior, VirtualListProps } from "./interface";
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
    const { itemCount, dividedAreaNum, factors } = props

    const groupList = useMemo(() => {
        const arr = Array.from({ length: itemCount }, (_, index) => index)
        return groupArray(arr, dividedAreaNum)
    }, [itemCount, dividedAreaNum])

    const [heights, actions] = useList<number>([])

    useEffect(() => {
        db.initWaitToPredictList(factors || [])
        db.restoreFromCache()
    }, [factors])

    useDBPredictFinished(db, (heights) => {
        actions.set(heights)
    })

    function handleItemHeightChange(index: number, height: number) {
        if (heights.length === 0) {
            return
        }

        actions.update(index, height)
    }

    return (
        <>
            {
                groupList.map((item, index) => (
                    <ListObserver key={index}
                        itemMinHeight={props.itemMinHeight}
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
    const { indexList, children, dividedAreaNum, isObserving, itemMinHeight, heights } = props
    const ref = useRef<HTMLDivElement>(null)
    const prevMinHeight = useRef<number>();

    const groupedList = useMemo(() => {
        return groupArray(indexList, dividedAreaNum)
    }, [indexList, dividedAreaNum])

    // The fourth param is only used to tell unit test current observing area.
    // @ts-ignore 
    const intersectionObserverEntry = useIntersection(ref, { threshold: 0 }, isObserving, `${indexList[0]}-${indexList[indexList.length - 1]}`)

    const minHeight = heights.length > 0
        ? indexList.reduce((prev, cur) => prev + heights[cur], 0)
        : indexList.length * itemMinHeight;
    
    useEffect(() => {
        prevMinHeight.current = minHeight
    })

    if (minHeight !== prevMinHeight.current) {
        console.log('height update', `${indexList[0]}-${indexList[indexList.length - 1]}`, prevMinHeight, minHeight)
    } else {
        console.log('height update', `${indexList[0]}-${indexList[indexList.length - 1]}`, prevMinHeight, minHeight)
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
                                            onItemHeightChange={props.onItemHeightChange}
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
                                            itemMinHeight={itemMinHeight}
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

    useTrackingValue(height, () => {
        props.onItemHeightChange?.(props.index, height)
    })

    return (
        <div role="item" ref={measuredRef}>
            {props.children({ index: props.index })}
        </div>
    )
}

export default VirtualList

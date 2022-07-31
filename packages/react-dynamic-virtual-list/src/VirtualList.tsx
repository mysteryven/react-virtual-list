import { useCallback, useEffect, useRef, useState } from "react";
import { useMemo } from "react"
import useIdleCallback from "./hooks/useIdleCallback";
import useIntersection from "./hooks/useIntersection";
import { ItemRendererProps, ListObserverProps, VirtualListProps } from "./interface";
import { groupArray } from "./utils";
import DB from './predictHeight/db'

const db = new DB();
(window as any).db = db;

export const ItemRenderer = (props: ItemRendererProps) => {
    const [height, setHeight] = useState<number>(0);

    const measuredRef = useCallback((node: HTMLDivElement) => {
        if (node !== null) {
            setHeight(node.getBoundingClientRect().height);
        }
    }, []);
    
    useIdleCallback(() => {
        // db.restoreFromCache()
        db.addToListLib(props.index, height)
    })

    return (
        <div role="item" ref={measuredRef}>
            {props.children({ index: props.index })}
        </div>
    )
}

export const ListObserver = (props: ListObserverProps) => {
    const { indexList, children, dividedAreaNum, isObserving, itemMinHeight } = props
    const ref = useRef<HTMLDivElement>(null)

    const groupedList = useMemo(() => {
        return groupArray(indexList, dividedAreaNum)
    }, [indexList, dividedAreaNum])

    // The fourth param is only used to tell unit test current observing area.
    // @ts-ignore 
    const intersectionObserverEntry = useIntersection(ref, { threshold: 0 }, isObserving, `${indexList[0]}-${indexList[indexList.length - 1]}`)

    return (
        <div ref={ref} role="list" style={{ minHeight: indexList.length * itemMinHeight }}>
            {
                intersectionObserverEntry && intersectionObserverEntry.isIntersecting ?
                    <>
                        {
                            groupedList.map((subGroupedList, index) => {
                                if (subGroupedList.length === 1) {
                                    return <ItemRenderer key={index} index={subGroupedList[0]} children={props.children} />
                                } else {
                                    return (
                                        <ListObserver
                                            key={index}
                                            indexList={subGroupedList}
                                            children={children}
                                            dividedAreaNum={dividedAreaNum}
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

const VirtualList = (props: VirtualListProps) => {
    const { itemCount, dividedAreaNum, factors } = props
    const groupList = useMemo(() => {
        const arr = Array.from({ length: itemCount }, (_, index) => index)
        return groupArray(arr, dividedAreaNum)
    }, [itemCount, dividedAreaNum])

    useEffect(() => {
        db.initWaitToPredictList(factors || [])
    }, [factors])

    return (
        <>
            {
                groupList.map((item, index) => (
                    <ListObserver key={index}
                        itemMinHeight={props.itemMinHeight}
                        dividedAreaNum={props.dividedAreaNum}
                        indexList={item}
                        isObserving={true}
                        children={props.children}
                    />
                ))
            }
        </>
    )
}

export default VirtualList

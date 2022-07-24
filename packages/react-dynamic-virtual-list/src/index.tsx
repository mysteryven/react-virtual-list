import React, { useRef } from "react";
import { useMemo } from "react"
import useIntersection from "./hooks/useIntersection";
import { ItemRendererProps, ListObserverProps, VirtualListProps } from "./interface";
import { groupArray } from "./utils";

export const ItemRenderer = (props: ItemRendererProps) => {
    return (
        <div role="item">
            {props.children({index: props.index})}
        </div>
    )
}

export const ListObserver = (props: ListObserverProps) => {
    const { indexList, children, dividedAreaNum, isObserving, itemMinHeight } = props
    const ref = useRef<HTMLDivElement>(null)

    const groupedList = useMemo(() => {
        return groupArray(indexList, dividedAreaNum)
    }, [indexList, dividedAreaNum])

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
    const { itemCount, dividedAreaNum } = props
    const groupList = useMemo(() => {
        const arr = Array.from({ length: itemCount }, (_, index) => index)
        return groupArray(arr, dividedAreaNum)
    }, [itemCount, dividedAreaNum])

    return (
        <>
            {
                groupList.map((item, index) => (
                    <ListObserver
                        key={index}
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

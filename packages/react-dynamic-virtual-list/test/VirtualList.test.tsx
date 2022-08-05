import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import VirtualList, { ItemRenderer, ListObserver } from "../src/VirtualList";
import { ListObserverProps, VirtualListProps } from "../src/interface";
import { intersectionMocker } from "./mock-dom-api/intersection-observer";

let visibleAreas: string[] = []

vi.mock('../src/hooks/useIntersection', () => {
    return {
        default: (ref: any, b: any, c: boolean, areas: string) => {
            if (c) {
                const observer = new IntersectionObserver(() => { }, {})
                observer.observe(ref.current)
            }

            return {
                isIntersecting: visibleAreas.includes(areas),
                target: ref.current
            }

        }
    }
})


describe('ItemRenderer', () => {
    it('should render with children', () => {
        const MyChild = () => (
            <div role="child">hello world</div>
        )
        render(<ItemRenderer children={MyChild} index={0} />)

        expect(screen.getByRole('child').textContent).toBe('hello world')
    })

    it('should receive index', () => {
        const MyChild = (props: any) => {
            return <div role="child">{props.index}</div>
        }

        render(<ItemRenderer children={MyChild} index={1000} />)

        expect(screen.getByRole('child').textContent).toBe('1000')
    })
})

describe('ListObserver', () => {
    beforeEach(() => {
        intersectionMocker.mock()
    })

    afterEach(() => {
        intersectionMocker.restore()
    })

    const initialProps: ListObserverProps = {
        indexList: [0, 1, 2, 3, 4, 5, 6],
        heights: [],
        children: ({ index }) => <div>{index}</div>,
        itemMinHeight: 60,
        dividedAreaNum: 2,
        isObserving: false
    }

    it('should observe only when isObserving is true', () => {
        const { rerender } = render(<ListObserver {...initialProps} />)
        expect(intersectionMocker.getObservers().length).toBe(0)

        rerender(<ListObserver {...initialProps} isObserving />)
        expect(intersectionMocker.getObservers().length).toBe(1)
    })

    it('should compute wrapper min-height by indexList.length and itemMinHeight', () => {
        const { queryByRole } = render(<ListObserver {...initialProps} />)
        expect(queryByRole('list')?.style.minHeight).toBe('420px')
    })


    it('should render ListObserver recursively', () => {
        const props: ListObserverProps = {
            indexList: [0, 1, 2, 3],
            children: ({ index }) => <div>{index}</div>,
            itemMinHeight: 60,
            dividedAreaNum: 2,
            heights: [],
            isObserving: true,
        }

        const { rerender, getAllByRole, } = render(<ListObserver {...props} />)
        visibleAreas.push('0-3')
        visibleAreas.push('0-1')

        rerender(<ListObserver {...props} />)
        expect(getAllByRole('list').length).toBe(3)
        expect(getAllByRole('item').length).toBe(2)
        const items = getAllByRole('item')

        expect(items[0].textContent).toBe('0')
        expect(items[1].textContent).toBe('1')
    })
})

describe('virtualList', () => {
    beforeEach(() => {
        intersectionMocker.mock()
    })

    afterEach(() => {
        intersectionMocker.restore()
    })

    it('should rerender when itemCount changes', () => {
        const props: VirtualListProps = {
            itemCount: 10,
            children: ({ index }) => <div>{index}</div>,
            itemMinHeight: 60,
            dividedAreaNum: 100,
        }

        const { rerender, getAllByRole } = render(<VirtualList {...props} />)
        expect(getAllByRole('list').length).toBe(10)
        rerender(<VirtualList {...props} itemCount={11} />)

        expect(getAllByRole('list').length).toBe(11)
    })

    it('should rerender when dividedAreaNum changes', () => {
        const props: VirtualListProps = {
            itemCount: 10,
            children: ({ index }) => <div>{index}</div>,
            itemMinHeight: 60,
            dividedAreaNum: 2,
        }

        const { rerender, getAllByRole } = render(<VirtualList {...props} />)
        expect(getAllByRole('list').length).toBe(2)
        rerender(<VirtualList {...props} dividedAreaNum={5} />)

        expect(getAllByRole('list').length).toBe(5)
    })
})
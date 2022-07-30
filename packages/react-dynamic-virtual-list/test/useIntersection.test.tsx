import { RefObject } from "react";
import { act, render, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { intersectionMocker } from "./mock-dom-api/intersection-observer";
import React from "react";
import useIntersection from "../src/hooks/useIntersection";

describe("useInterseciton", () => {
    let container = document.createElement("div");
    let targetRef: RefObject<HTMLDivElement>;

    beforeEach(() => {
        intersectionMocker.mock()
    })

    afterEach(() => {
        intersectionMocker.restore()
    })

    it('should setup a observe to target and using options provided', () => {
        act(() => {
            targetRef = React.createRef<HTMLDivElement>()
            render(<div ref={targetRef} />, { container })
        })

        expect(intersectionMocker.getObservers()).toHaveLength(0)

        const intersectionOptions = {
            root: container,
            threshold: 0.5,
        }

        renderHook(() => useIntersection(
            targetRef!,
            intersectionOptions,
            true
        ))

        const observers = intersectionMocker.getObservers()
        expect(observers).toHaveLength(1)
        expect(observers[0].options).toBe(intersectionOptions)
        expect(observers[0].target).toBe(targetRef?.current)
    })

    it('should return null if IntersectionObserver is not supported', () => {
        act(() => {
            targetRef = React.createRef<HTMLDivElement>()
            render(<div ref={targetRef} />, { container })
        })
        delete (global as any).IntersectionObserver

        const { result } = renderHook(() => useIntersection(targetRef, {}, true))
        expect(result.current).toBeNull()
    })

    it('should return null if target is not provided', () => {
        targetRef = React.createRef()

        const { result } = renderHook(() => useIntersection(targetRef, {}, true))
        expect(result.current).toBeNull()
        expect(intersectionMocker.getObservers()).toHaveLength(0)
    })

    it('should disconnect observer when isActive is `false`', () => {
        act(() => {
            targetRef = React.createRef<HTMLDivElement>()
            render(<div ref={targetRef} />, { container })
        })

        const { rerender } = renderHook((isActive: boolean = true) => useIntersection(targetRef, {}, isActive))
        expect(intersectionMocker.getObservers()).toHaveLength(1)

        rerender(false)
        const observers = intersectionMocker.getObservers()
        expect(observers).toHaveLength(0)
    })

    it('should reset intersectionObserverEntry when ref changes', () => {
        act(() => {
            targetRef = React.createRef<HTMLDivElement>()!
            render(<div ref={targetRef} />, { container })
        })

        const { result, rerender } = renderHook(() => useIntersection(targetRef, {}, true))

        // https://w3c.github.io/IntersectionObserver/#intersectionobserverentry
        let mockIntersectionObserveEntry = {
            time: new Date().getTime(),
            rootBounds: targetRef?.current?.getBoundingClientRect()!,
            boundingClientRect: targetRef.current?.getBoundingClientRect()!,
            intersectionRect: targetRef.current?.getBoundingClientRect()!,
            isIntersecting: true,
            intersectionRatio: 0.4,
            target: targetRef?.current!,
        }

        act(() => {
            intersectionMocker.simulate(mockIntersectionObserveEntry!)
        })

        expect(result.current).toEqual(mockIntersectionObserveEntry)

        // @ts-ignore
        targetRef.current = document.createElement('div')

        rerender()
        expect(result.current).toBeNull()
    })

    it('should setup a new IntersectionObserver when ref changes', () => {
        act(() => {
            targetRef = React.createRef<HTMLDivElement>()
            render(<div ref={targetRef} />, { container })
        })

        const { rerender } = renderHook((props: { ref: RefObject<HTMLDivElement> }) => useIntersection(props.ref, {}, true), {
            initialProps: {
                ref: targetRef,
            }
        });

        expect(intersectionMocker.getObservers()[0].target).toBe(targetRef.current)

        const newTarget = React.createRef<HTMLDivElement>();
        // @ts-ignore
        newTarget.current = document.createElement("div")
        rerender({ ref: newTarget })
        expect(intersectionMocker.getObservers()[0].target).toBe(newTarget.current)
    })

    it('should setup a new IntersectionObserver when options changes', () => {
        act(() => {
            targetRef = React.createRef()
            render(<div ref={targetRef} />)
        })

        const options = {
            root: document,
            threshold: [0.1, 0.2]
        }
        const { rerender } = renderHook((props: { options: IntersectionObserverInit }) => useIntersection(targetRef, props.options, true), {
            initialProps: { options }
        })

        const newOptions = {
            root: document,
            threshold: [0.1, 0.2]
        }
        rerender({options: newOptions})

        // threshold will apply join if it is Array
        expect(intersectionMocker.getObservers()[0].options).toEqual(options)
        expect(intersectionMocker.getObservers()[0].options).toEqual(newOptions)

        newOptions.threshold.push(0.3)
        rerender({options: newOptions})
        expect(intersectionMocker.getObservers()[0].options).toEqual(newOptions)
    })
})



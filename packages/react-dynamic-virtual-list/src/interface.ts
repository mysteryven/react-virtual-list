import { FunctionComponent } from "react";
import { Vector } from "./predictHeight/EM";

export interface ChildItemProps {
    index: number
}
export interface VirtualListProps {
    children: FunctionComponent<ChildItemProps>;
    dividedAreaNum: number;
    itemCount: number;
    itemMinHeight: number;
    factors?: Vector[]
}

export interface ListObserverProps {
    indexList: number[];
    children: FunctionComponent<ChildItemProps>;
    dividedAreaNum: number;
    itemMinHeight: number
    isObserving: boolean;
    heights: number[]
}

export interface ItemRendererProps {
    children: FunctionComponent<ChildItemProps>;
    index: number
}

export enum UnsupportedBehavior {
    immediate,
    timeout
}

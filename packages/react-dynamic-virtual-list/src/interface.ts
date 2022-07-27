import { FunctionComponent } from "react";

export interface ChildItemProps {
    index: number
}
export interface VirtualListProps {
    children: FunctionComponent<ChildItemProps>;
    dividedAreaNum: number;
    itemCount: number;
    itemMinHeight: number;
}

export interface ListObserverProps {
    indexList: number[];
    children: FunctionComponent<ChildItemProps>;
    dividedAreaNum: number;
    itemMinHeight: number
    isObserving: boolean;
}

export interface ItemRendererProps {
    children: FunctionComponent<ChildItemProps>;
    index: number
}

export enum UnsupportedBehavior {
    Immedidate,
    requestAnimation,
    timeout
}

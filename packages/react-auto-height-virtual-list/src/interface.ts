import { FunctionComponent } from "react";
import PredictDatabase from "./predictHeight/db";
import { Vector } from "./predictHeight/EM";

export interface ChildItemProps {
    index: number
}
export interface VirtualListProps {
    children: FunctionComponent<ChildItemProps>;
    dividedAreaNum: number;
    itemCount: number;
    itemHeight: number;
    factors?: Vector[];
    useDynamicHeight?: boolean
}

export interface ListObserverProps {
    indexList: number[];
    children: FunctionComponent<ChildItemProps>;
    dividedAreaNum: number;
    isObserving: boolean;
    heights: HeightItem[];
    db?: PredictDatabase;
    onItemHeightChange?: (index: number, height: number) => void;
    useDynamicHeight?: boolean;
}

export interface ItemRendererProps {
    children: FunctionComponent<ChildItemProps>;
    db?: PredictDatabase;
    index: number;
    onItemHeightChange?: (index: number, height: number) => void;
}

export enum UnsupportedBehavior {
    immediate,
    timeout
}

export interface HeightItem {
    type: 'default' | 'predict' | 'real';
    value: number
}

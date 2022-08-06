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
    itemMinHeight: number;
    factors?: Vector[];
}

export interface ListObserverProps {
    indexList: number[];
    db: PredictDatabase;
    children: FunctionComponent<ChildItemProps>;
    dividedAreaNum: number;
    isObserving: boolean;
    heights: HeightItem[];
    itemMinHeight: number;
    onItemHeightChange: (index: number, height: number) => void;
}

export interface ItemRendererProps {
    children: FunctionComponent<ChildItemProps>;
    db: PredictDatabase;
    index: number;
    onItemHeightChange: (index: number, height: number) => void;
}

export enum UnsupportedBehavior {
    immediate,
    timeout
}

export interface HeightItem {
    type: 'default' | 'predict' | 'real';
    value: number
}

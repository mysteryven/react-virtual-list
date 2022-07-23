import { FunctionComponent } from "react"

interface RenderItemProps {
    index: number
}
interface VirtualListProps {
    children: FunctionComponent<RenderItemProps>;
    num: number
}

const VirtualList = (props: VirtualListProps) => {

    return (
        <div>

        </div>
    )
}

const App = () => {

    return (
        <div>
            <VirtualList>
                {(props) => <div>{props.index}</div>}
            </VirtualList>
        </div>
    )
}
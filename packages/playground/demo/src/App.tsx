import { useMemo, useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import VirtualList, { ChildItemProps } from 'react-dynamic-virtual-list'

function App() {
  const originalList = useMemo(() => Array.from(Array(4).keys()), []);

  return (
    <div>
      <VirtualList dividedAreaNum={10} itemCount={4} itemMinHeight={40}>
        {
          (props) => <ListItem index={props.index} />
        }
      </VirtualList>
    </div>
  )
}



function ListItem(props: ChildItemProps) {
  const str = 'Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.'
  const times = Math.floor(10 * Math.random())

  return (
    <div className="item">
      <h1 className="left">
        {props.index}
      </h1>
      <div className="right">
        {str.repeat(times)}
      </div>
    </div>
  )
}

export default App

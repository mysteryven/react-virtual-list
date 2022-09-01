import React from 'react'
import './App.css'
import VirtualList, { ChildItemProps } from '../../src/index'

const str = `
  Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.
  Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.
  Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.
`;

const arrayLength = 100

const originalList = new Array(arrayLength).fill(0).map(i => {
  return {
    memo: str.slice(Math.floor(Math.random() * str.length)),
    images: new Array(Math.floor(Math.random() * 12)).fill(0)
  }
})

function App() {

  const factors = originalList.map(i => {
    return [i.memo.length, i.images.length]
  })

  return (
    <div>
      <VirtualList dividedAreaNum={10} itemCount={arrayLength} itemHeight={40} useDynamicHeight factors={factors}>
        {
          (props: any) => <ListItem index={props.index} />
        }
      </VirtualList>
    </div>
  )
}

function ListItem(props: ChildItemProps) {
  const index = props.index

  return (
    <div className="item">
      <h1 className="left">
        {index}
      </h1>
      <div className="right">
        <div style={{ fontSize: '32px', lineHeight: '1.4' }}>
          {originalList[index].memo}
        </div>
        <div>
          {
            originalList[index].images.map((_, i) => (
              <div key={i} className="image"></div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default App
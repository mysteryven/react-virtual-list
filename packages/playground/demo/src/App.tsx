import './App.css'
import VirtualList, { ChildItemProps } from 'react-dynamic-virtual-list'

const str = `
  Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.
  Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.
  Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit amet quam egestas semper. Aenean ultricies mi vitae est.
`;

const originalList = new Array(100).fill(0).map(i => {
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
      <VirtualList dividedAreaNum={10} itemCount={100} itemMinHeight={40} factors={factors}>
        {
          (props) => <ListItem index={props.index} />
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
        <div style={{ fontSize: '14px', lineHeight: '1.4' }}>
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

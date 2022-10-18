# React-Virtual-List

[![npm version](https://badgen.net/npm/v/react-predict-virtual)](https://npm.im/react-predict-virtual) 
[![npm downloads](https://badgen.net/npm/dm/react-predict-virtual)](https://npm.im/react-predict-virtual)

> A React Virtual List for dynamic item height based Intersection API

## Install

```bash
pnpm i react-predict-virtual
```

## Preview

```bash
pnpm example
```

## Build

```bash
pnpm build
```

## Usage

| props | description | type |
|----|----| --- |
| `itemCount` | required，the count of items| `number`|
| `itemHeight` | required，the min height of item| `number`|
| `dividedAreaNum` | 默认是 10，每一层的数据被划分为多少个区块 | `number` |
| `useDynamicHeight` | 不是必填，默认 false，是否使用动态计算高度 | `boolean` |
| `factors` | 不是必填，用于描述数据的特征向量 | `number[]` |
| `version` | 不是必填，version 变化，会清空原有的数据，假如 `factors` 的含义变了，想重置数据库，可以改这个 | `number` |

## Example

### with fixed height

```ts
 <VirtualList dividedAreaNum={10} itemCount={arrayLength} itemHeight={40}>
    {
        (props: any) => <div />{props.index} </div>
    }
</VirtualList>
```

### with dynamic height

```ts
import VirtualList, { ChildItemProps } from 'react-predict-virtual'
import createPredictWorker from 'react-predict-virtual/createPredictWorker'

const arrayLength = 1000

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
      <VirtualList 
        dividedAreaNum={10}
        itemCount={arrayLength}
        itemHeight={40}
        createPredictWorker={createPredictWorker}
      >
        {
          (props: ChildItemProps) => <ListItem index={props.index} />
        }
      </VirtualList>
    </div>
  )
}
```

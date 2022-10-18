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
| `dividedAreaNum` | The default is 10, which indicates how many blocks the data in each layer is divided into | `number` |
| `useDynamicHeight` | Not required, default `false`, whether to use dynamic height calculation | `boolean` |
| `factors` | This field is not required. It is used to describe the eigenvector of the data | `number[]` |
| `version` | If 'factors' has changed, you can change this if you want to reset the database | `number` |

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
import PredictWorker from './worker?worker&inline'
const createPredictWorker = () => new PredictWorker()

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


```ts
// filename worker.ts
import { exportWorker } from "use-worker-async";
import { beginPredict } from "../../src/predictHeight/worker";

exportWorker(beginPredict)
```
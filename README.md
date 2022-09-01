# React-Virtual-List

online demo 等待补充.

[![npm version](https://badgen.net/npm/v/react-predict-virtual)](https://npm.im/react-predict-virtual) 
[![npm downloads](https://badgen.net/npm/dm/react-predict-virtual)](https://npm.im/react-predict-virtual)

> A React Virtual List for dynamic item height based Intersection API

## 安装

```bash
pnpm i react-predict-virtual
```

## 调试
### 预览效果

```bash
pnpm example
```

### 打包

```bash
pnpm build
```

## 原理简述 

1. 划分区块的方式来使用 Intersection


2. 收集数据源的特征值，根据已经存储的数据源预测数据

当开启了动态计算高度（useDynamicHeight），会不断收集样本，并存储在本地数据库中待用，当样本数量到达可以预测高度的量级的时候，取出所有数据，对所有的样本进行分析，得到聚类点，然后再把当前的数据去归类到聚类点里，看看离哪一个点最近，就预测成它的高度。

## 参数说明

| 名称 | 含义 | 类型 |
|----|----| --- |
| itemCount | 必填，有多少个子项| `number`|
| itemHeight | 必填，子项的高度| `number`|
| dividedAreaNum | 不是必填，默认是 10，每一层的数据被划分为多少个区块 | `number` |
| useDynamicHeight | 不是必填，默认 false，是否使用动态计算高度 | `boolean` |
| factors | 不是必填，用于描述数据的特征向量 | `number[]` |
| version | 不是必填，version 变化，会清空原有的数据，假如 `factors` 的含义变了，想重置数据库，可以改这个 | `number` |

### 特别说明 

1. `dividedAreaNum`

假设我们有一万条数据，每一个都使用 Intersection API 监听是否出现在视口，页面会很卡，所以我采用了把所有数据分组的方法。举一个具体的例子：

假设有 8 条数据，视口只能看两条，我们设置了 dividedAreaNum 为 2。这样子的话，首先所有的数据会被根据 dividedAreaNum 分成两大区块：0-3，4-7。如果只有第 0、1 在视口，那 4-7 就只会渲染一个空有 4 份高度的 div。同理，在 0 - 3 中，1-2 不在视口，也只是渲染空有高度的 div。这样下来，就算 10000 笔数据， Intersection 的监听也能控制在 30 个左右。

2. `factors`

为了预测高度，必须要有一定的样本支持，但是在数据中，不同的值对高度的影响度不一样。假设我们有一份数据：

```js
[ 
  { text: 'Hello world', images: ['./a.png'] },
  { text: 'Hello world', images: ['./b.png'] } 
]
```

可能 40 个长度的 `text` 对高度的影响能力等于一张图片，那 factors 可以这么设置：

```js
list.map(item => [text.length, images.length * 40])
```

## 使用

### 固定高度

```ts
 <VirtualList dividedAreaNum={10} itemCount={arrayLength} itemHeight={40}>
    {
        (props: any) => <div />{props.index} </div>
    }
</VirtualList>
```

### 动态高度

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

# react-virtual-list


> 基于 Interseciton API 实现，这是一个专门用于子项动态高度的虚拟列表。

**这只是一个实验性的库，只是写着玩玩的。**

## 安装

```bash
pnpm i react-auto-height-virtual-list
```

## 原理解释

当开启了动态计算高度，会不断收集样本，并存储在 IndexDB 中待用，当样本数量到达可以预测高度的量级的时候，取出所有数据，对所有的样本进行分析，得到聚类点，然后再把当前的数据去归类到聚类点里，看看离哪一个点最近，就预测成它的高度。

// TODO
// 将要增加在线 Demo

## 参数说明

| 名称 | 含义 | 类型 |
|----|----| --- |
| itemCount | 必填，有多少个子项| `number`|
| itemHeight | 必填，子项的高度| `number`|
| dividedAreaNum | 不是必填，默认是 10，数据被划分为多少个区块 | `number` |
| useDynamicHeight | 不是必填，默认 false，是否使用动态计算高度 | `boolean` |
| factor | 不是必填，用于描述数据的特征向量 | number[] |

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
      <VirtualList dividedAreaNum={10} itemCount={arrayLength} itemHeight={40}>
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
```

export function groupArray<T>(inputStream: T[], groupNum: number): T[][] {
    const bucketNum = Math.min(Math.max(1, groupNum), inputStream.length)

    const bucketSizeArr = new Array(bucketNum).fill(0)
    const bucket: T[][] = Array.from({ length: bucketNum }, () => [])

    inputStream.forEach((_, index) => {
        bucketSizeArr[index % bucketNum]++
    })

    let bucketIndex = 0
    inputStream.forEach((item) => {
        if (bucketSizeArr[bucketIndex] === 0) {
            bucketIndex++
        }

        bucket[bucketIndex].push(item)
        bucketSizeArr[bucketIndex]--
    })
    

    return bucket
};
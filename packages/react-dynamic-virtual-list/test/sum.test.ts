import { test, expect } from 'vitest'
import sum from '../src/sum'

test('sum', async () => {
    expect(sum(1, 2)).toBe(3)
})

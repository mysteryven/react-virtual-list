import { test, expect } from 'vitest'
import { render } from '@testing-library/react'
import Button from '../src/button'

test('loads and displays hello world', async () => {
    const { container } = render(<Button />)
    const button = container.querySelector('[role="button"]')
    expect(button?.textContent === 'Hello World').toBe(true)
})

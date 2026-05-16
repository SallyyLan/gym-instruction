import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import CalloutDiagram from './CalloutDiagram'

describe('CalloutDiagram', () => {
  it('renders an img with the callout src', () => {
    render(<CalloutDiagram src="/images/callout.jpg" alt="Machine diagram" />)
    const img = document.querySelector('img')
    expect(img?.getAttribute('src')).toBe('/images/callout.jpg')
  })
})

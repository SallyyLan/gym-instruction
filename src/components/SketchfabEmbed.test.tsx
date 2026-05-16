import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import SketchfabEmbed from './SketchfabEmbed'

describe('SketchfabEmbed', () => {
  it('renders an iframe containing the model ID in its src', () => {
    render(<SketchfabEmbed modelId="abc123" title="Test Machine" />)
    const iframe = document.querySelector('iframe')
    expect(iframe).toBeTruthy()
    expect(iframe?.src).toContain('abc123')
  })

  it('shows a loading skeleton before the iframe loads', () => {
    render(<SketchfabEmbed modelId="abc123" title="Test Machine" />)
    expect(document.querySelector('[data-testid="sketchfab-skeleton"]')).toBeTruthy()
  })
})

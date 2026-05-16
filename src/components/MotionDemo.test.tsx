import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import MotionDemo from './MotionDemo'

describe('MotionDemo', () => {
  it('renders an img with the gif src', () => {
    render(<MotionDemo src="/videos/test.gif" alt="Test exercise" />)
    const img = document.querySelector('img')
    expect(img?.getAttribute('src')).toBe('/videos/test.gif')
  })
})

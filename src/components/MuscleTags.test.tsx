import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MuscleTags from './MuscleTags'

describe('MuscleTags', () => {
  it('renders each muscle tag', () => {
    render(<MuscleTags tags={['背部', '手臂']} />)
    expect(screen.getByText('背部')).toBeTruthy()
    expect(screen.getByText('手臂')).toBeTruthy()
  })
})

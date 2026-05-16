import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import WarningBox from './WarningBox'

describe('WarningBox', () => {
  it('renders the warning text', () => {
    render(<WarningBox text="Stop if you feel pain" />)
    expect(screen.getByText('Stop if you feel pain')).toBeTruthy()
  })
})

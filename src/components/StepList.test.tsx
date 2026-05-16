import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StepList from './StepList'

describe('StepList', () => {
  it('renders each step with its number', () => {
    render(<StepList steps={['First step', 'Second step']} />)
    expect(screen.getByText('First step')).toBeTruthy()
    expect(screen.getByText('Second step')).toBeTruthy()
    expect(screen.getByText('1')).toBeTruthy()
    expect(screen.getByText('2')).toBeTruthy()
  })
})

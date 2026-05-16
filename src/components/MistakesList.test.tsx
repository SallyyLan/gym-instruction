import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import MistakesList from './MistakesList'

describe('MistakesList', () => {
  it('renders each mistake', () => {
    render(<MistakesList mistakes={['Bad form', 'Wrong weight']} />)
    expect(screen.getByText('Bad form')).toBeTruthy()
    expect(screen.getByText('Wrong weight')).toBeTruthy()
  })
})

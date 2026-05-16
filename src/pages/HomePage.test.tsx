import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HomePage from './HomePage'
import '../i18n/index'

describe('HomePage', () => {
  it('renders 5 machine card links', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    const links = document.querySelectorAll('a[href^="/machine/"]')
    expect(links).toHaveLength(5)
  })

  it('renders the page heading in zh', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>
    )
    expect(screen.getByText('所有器材')).toBeTruthy()
  })
})

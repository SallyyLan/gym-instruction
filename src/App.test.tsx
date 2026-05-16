import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import App from './App'
import './i18n/index'

describe('App routing', () => {
  it('renders HomePage at /', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )
    expect(document.querySelector('a[href^="/machine/"]')).toBeTruthy()
  })

  it('renders NotFoundPage for an unknown route', () => {
    render(
      <MemoryRouter initialEntries={['/totally-unknown']}>
        <App />
      </MemoryRouter>
    )
    expect(screen.getByText('找不到此器材頁面')).toBeTruthy()
  })
})

import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFoundPage from './NotFoundPage'
import '../i18n/index'

describe('NotFoundPage', () => {
  it('renders the not-found message in zh', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    )
    expect(screen.getByText('找不到此器材頁面')).toBeTruthy()
  })

  it('has a link back to /', () => {
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>
    )
    expect(document.querySelector('a[href="/"]')).toBeTruthy()
  })
})

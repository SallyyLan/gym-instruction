import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import QRCodesPage from './QRCodesPage'
import '../i18n/index'

describe('QRCodesPage', () => {
  it('renders a QR code for each of the 5 machines', () => {
    render(
      <MemoryRouter>
        <QRCodesPage />
      </MemoryRouter>
    )
    const svgs = document.querySelectorAll('svg')
    expect(svgs.length).toBe(5)
  })

  it('renders the page title', () => {
    render(
      <MemoryRouter>
        <QRCodesPage />
      </MemoryRouter>
    )
    expect(screen.getByText('器材 QR Code')).toBeTruthy()
  })
})

import { describe, it, expect } from 'vitest'
import { render as rtlRender, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import MachinePage from './MachinePage'
import '../i18n/index'

const renderAt = (id: string) =>
  rtlRender(
    <MemoryRouter initialEntries={[`/machine/${id}`]}>
      <Routes>
        <Route path="/machine/:id" element={<MachinePage />} />
      </Routes>
    </MemoryRouter>
  )

describe('MachinePage', () => {
  it('renders the machine name for pivot-leg-press in zh', () => {
    renderAt('pivot-leg-press')
    expect(screen.getByText('旋轉腿部推蹬機')).toBeTruthy()
  })

  it('renders a link back to home', () => {
    renderAt('pivot-leg-press')
    expect(document.querySelector('a[href="/"]')).toBeTruthy()
  })

  it('shows the not-found message for an unknown machine id', () => {
    renderAt('unknown-machine-xyz')
    expect(screen.getByText('找不到此器材頁面')).toBeTruthy()
  })
})

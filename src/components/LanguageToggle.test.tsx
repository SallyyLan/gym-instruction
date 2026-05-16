import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LanguageToggle from './LanguageToggle'
import '../i18n/index'

describe('LanguageToggle', () => {
  it('renders a button', () => {
    render(<LanguageToggle />)
    expect(screen.getByRole('button')).toBeTruthy()
  })

  it('toggles language on click without throwing', async () => {
    render(<LanguageToggle />)
    await userEvent.click(screen.getByRole('button'))
    expect(screen.getByRole('button')).toBeTruthy()
  })
})

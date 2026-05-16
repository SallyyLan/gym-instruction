import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import MachineCard from './MachineCard'
import type { Machine } from '../types/machine'
import '../i18n/index'

const mock: Machine = {
  id: 'lat-pulldown',
  name: { zh: '滑輪下拉機', en: 'Lat Pulldown Machine' },
  description: { zh: '訓練背部', en: 'Trains back' },
  thumbnail: '/images/thumb.jpg',
  muscles: [{ zh: '背部', en: 'Back' }],
  sketchfabId: 'abc123',
  gif: '/videos/test.gif',
  callout: '/images/callout.jpg',
  steps: [{ zh: '步驟一', en: 'Step one' }],
  mistakes: [{ zh: '錯誤一', en: 'Mistake one' }],
  warning: { zh: '注意', en: 'Warning' },
}

describe('MachineCard', () => {
  it('renders the machine name in zh by default', () => {
    render(
      <MemoryRouter>
        <MachineCard machine={mock} />
      </MemoryRouter>
    )
    expect(screen.getByText('滑輪下拉機')).toBeTruthy()
  })

  it('links to /machine/lat-pulldown', () => {
    render(
      <MemoryRouter>
        <MachineCard machine={mock} />
      </MemoryRouter>
    )
    expect(document.querySelector('a')?.getAttribute('href')).toBe('/machine/lat-pulldown')
  })

  it('renders the muscle tag', () => {
    render(
      <MemoryRouter>
        <MachineCard machine={mock} />
      </MemoryRouter>
    )
    expect(screen.getByText('背部')).toBeTruthy()
  })
})

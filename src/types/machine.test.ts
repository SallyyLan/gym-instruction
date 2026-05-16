import { describe, it, expect } from 'vitest'
import machines from '../data/machines.json'
import type { Machine } from './machine'

describe('machines.json', () => {
  it('has 5 machines', () => {
    expect(machines).toHaveLength(5)
  })

  it('each machine has all required fields', () => {
    const required: (keyof Machine)[] = [
      'id', 'name', 'description', 'thumbnail',
      'sketchfabId', 'steps', 'mistakes', 'warning',
    ]
    machines.forEach((m: Machine) => {
      required.forEach((field) => {
        expect(m, `machine "${m.id}" missing field "${field}"`).toHaveProperty(field)
      })
    })
  })

  it('each machine has at least 2 steps', () => {
    machines.forEach((m: Machine) => {
      expect(m.steps.length, `machine "${m.id}" needs ≥2 steps`).toBeGreaterThanOrEqual(2)
    })
  })

  it('each machine has at least 1 mistake', () => {
    machines.forEach((m: Machine) => {
      expect(m.mistakes.length, `machine "${m.id}" needs ≥1 mistake`).toBeGreaterThanOrEqual(1)
    })
  })
})

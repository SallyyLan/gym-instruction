import { describe, it, expect } from 'vitest'
import zh from './zh.json'
import en from './en.json'

describe('i18n translation files', () => {
  it('zh and en have identical keys', () => {
    expect(Object.keys(zh).sort()).toEqual(Object.keys(en).sort())
  })

  it('zh has all required UI keys', () => {
    const required = [
      'browseAll', 'steps', 'mistakes', 'warning',
      'notFound', 'backToHome', 'printAll', 'qrPageTitle',
      'loading', 'switchLang',
    ]
    required.forEach((key) => {
      expect(zh, `missing key: ${key}`).toHaveProperty(key)
    })
  })
})

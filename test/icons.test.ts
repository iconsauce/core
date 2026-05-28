import { icons } from '../src/lib/icons'
import { configTest } from './fixtures/config'

describe('Icons', () => {
  beforeAll(() => {
    configTest.verbose = true
  })

  afterAll(() => {
    configTest.verbose = false
  })

  test('Loads the plugin correctly and return icons dictionary', async () => {
    const data = await icons(configTest)
    const keys = Array.from(data.keys())
    expect(keys.length).toBeGreaterThan(100)
    expect(keys.some(k => k.startsWith('mi/'))).toBe(true)
    expect(keys.some(k => k.startsWith('mdi/'))).toBe(true)
  })

  test('All icon values are paths ending with .svg', async () => {
    const data = await icons(configTest)
    for (const value of data.values()) {
      expect(value.toString()).toMatch(/\.svg$/)
    }
  })
})

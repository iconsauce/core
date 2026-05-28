import chalk from 'chalk'
import { type PathLike } from 'fs'
import { occurrences } from '../src/lib/occurrences'
import { configTest } from './fixtures/config'
import files from './fixtures/files'

describe('Occurrences', () => {
  beforeAll(() => {
    chalk.level = 0
    configTest.verbose = true
  })

  afterAll(() => {
    configTest.verbose = false
  })

  test('Check the selectors are properly loaded from source files', async () => {
    const data: { occurrences: string[], map: Map<string, PathLike> } = await occurrences(configTest, files)
    expect(data.map.get('mi/baseline/close')).toMatch(/component-mi.tsx/)
    expect(data.map.get('mdi/access-point')).toMatch(/component-mdi.tsx/)
    expect(data.map.get('mgg/isbn')).toMatch(/component-mgg.tsx/)
    expect(data.map.get('mi/baseline/accessible-forward')).toMatch(/component.tsx/)
    expect(data.map.get('mgg/todo-in-prendere-in-carico')).toMatch(/variants.ts/)
    expect(new Set(data.occurrences)).toContain('mi/baseline/non-existing-selector')
  })

  test('Check the errors are thrown as expected', async () => {
    await expect(occurrences(configTest, ['non/exisising/file.tsx'])).rejects.toThrow(/ENOENT/)
  })

  test('Occurrences are returned sorted alphabetically', async () => {
    const data = await occurrences(configTest, files)
    expect(data.occurrences).toEqual([...data.occurrences].sort())
  })

  test('Occurrences are deduplicated across files', async () => {
    const data = await occurrences(configTest, files)
    expect(data.occurrences.length).toBe(new Set(data.occurrences).size)
  })
})

import chalk from 'chalk'
import { readdir, rm, readFile } from 'fs/promises'
import { exportMap, exportSVG } from '../src/lib/utils'
import filteredDictionary from './fixtures/filtered-dictionary'
import { iconsDictionary } from './fixtures/icons'

describe('export functionality', () => {
  const testDirectory = './test/temp'

  beforeAll(() => {
    chalk.level = 0
  })

  afterEach(async () => {
    await rm(testDirectory, { recursive: true, force: true })
  })

  test('export map writes a valid JSON array of icon keys', async () => {
    const testFile = `${testDirectory}/temp.json`
    await exportMap(iconsDictionary, testFile)
    const content = await readFile(testFile, 'utf8')
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsed = JSON.parse(content)
    expect(Array.isArray(parsed)).toBe(true)
    expect(parsed).toEqual(Array.from(iconsDictionary.keys()))
  })

  test('should throw error when filepath is not a json file path', async () => {
    await expect(exportMap(iconsDictionary, testDirectory)).rejects.toThrow(/is not a json file path/)
  })

  test('export svg', async () => {
    await exportSVG(filteredDictionary, testDirectory)
    // replace sep path for windows
    const files = (await readdir(testDirectory, { recursive: true })).map(p => p.replace(/\\/g, '/'))
    filteredDictionary.forEach((_icons, path) => {
      expect(files).toContain(`${path}.svg`)
    })
  })

  test('export map with empty dictionary writes an empty JSON array', async () => {
    const testFile = `${testDirectory}/empty.json`
    await exportMap(new Map(), testFile)
    const content = await readFile(testFile, 'utf8')
    expect(JSON.parse(content)).toEqual([])
  })

  test('export svg with empty dictionary does not throw', async () => {
    await expect(exportSVG(new Map(), testDirectory)).resolves.toBeUndefined()
  })
})

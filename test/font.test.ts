import chalk from 'chalk'
import { fontBase64 } from '../src/lib/font'
import { occurrencesCleaned } from './fixtures/selectors'
import { configTest } from './fixtures/config'
import filteredDictionary from './fixtures/filtered-dictionary'

describe('Font', () => {
  beforeAll(() => {
    chalk.level = 0
  })

  test('Check the Base64 generated font is valid base64 without padding', async () => {
    const { base64font } = await fontBase64(configTest, filteredDictionary)
    expect(base64font.length).toBeGreaterThan(0)
    expect(base64font).toMatch(/^[A-Za-z0-9+/]*$/)
    expect(base64font).not.toMatch(/=$/)
  })

  test('Check it throw error cause icons are empty', async () => {
    await expect(fontBase64(configTest, new Map())).rejects.toThrow(/Icons map cannot be empty/)
  })

  test('Check the dictionary generated', async () => {
    const data = await fontBase64(configTest, filteredDictionary)
    const keys = Array.from(data.dictionary.keys())
    expect(keys).toEqual(occurrencesCleaned)
  })

  test('Dictionary size matches the input icons map', async () => {
    const { dictionary } = await fontBase64(configTest, filteredDictionary)
    expect(dictionary.size).toBe(filteredDictionary.size)
  })

  test('Dictionary values are sequential unicode codepoints starting at U+EA01', async () => {
    const { dictionary } = await fontBase64(configTest, filteredDictionary)
    const values = Array.from(dictionary.values())
    values.forEach((char, i) => {
      expect(char.codePointAt(0)).toBe(0xea01 + i)
    })
  })

  test('Each icon gets a unique unicode character', async () => {
    const { dictionary } = await fontBase64(configTest, filteredDictionary)
    const values = Array.from(dictionary.values())
    expect(new Set(values).size).toBe(values.length)
  })

  test('Works with a single icon', async () => {
    const [firstKey, firstValue] = Array.from(filteredDictionary.entries())[0]
    const singleIcon = new Map([[firstKey, firstValue]])
    const { base64font, dictionary } = await fontBase64(configTest, singleIcon)
    expect(base64font.length).toBeGreaterThan(0)
    expect(dictionary.size).toBe(1)
    expect(dictionary.get(firstKey)!.codePointAt(0)).toBe(0xea01)
  })
})

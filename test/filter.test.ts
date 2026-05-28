import chalk from 'chalk'
import { filter } from '../src/lib/filter'
import filteredDictionary from './fixtures/filtered-dictionary'
import dictionary from './fixtures/dictionary'
import selectors from './fixtures/selectors'
import { configTest } from './fixtures/config'

describe('Filter', () => {
  beforeAll(() => {
    chalk.level = 0
  })

  afterEach(() => {
    configTest.skipWarnings = true
  })

  test('Check it returns a filtered map of selected icons', () => {
    expect(filter(configTest, dictionary, selectors)).toEqual(filteredDictionary)
  })

  test('Check the errors are thrown as expected', () => {
    configTest.skipWarnings = false
    expect(() => filter(configTest, dictionary, selectors)).toThrow(/not found/)
  })

  test('Empty selectors list returns an empty map', () => {
    const result = filter(configTest, dictionary, { occurrences: [], map: new Map() })
    expect(result.size).toBe(0)
  })

  test('All matching selectors returns the complete filtered map', () => {
    const allMatching = {
      occurrences: Array.from(filteredDictionary.keys()),
      map: new Map(),
    }
    const result = filter(configTest, dictionary, allMatching)
    expect(result).toEqual(filteredDictionary)
  })
})

import { IconsauceConfig } from '../src/index'
import { Config } from '../src/interface/config'
import path from 'path'
import { configTest } from './fixtures/config'

describe('IconsauceConfig', () => {
  let config: Config

  afterEach(() => {
    expect(config.content).toEqual(configTest.content)
    expect(config.fontFamily).toEqual(configTest.fontFamily)
    expect(config.fontSize).toEqual(configTest.fontSize)
    expect(config.skipWarnings).toEqual(configTest.skipWarnings)
    expect(config.verbose).toEqual(configTest.verbose)
    expect(config.plugin.length).toEqual(configTest.plugin.length)
  })
  test('should loads a config when path setted', () => {
    config = new IconsauceConfig(path.resolve(__dirname, './fixtures/iconsauce.config.js'))
  })
  test('should loads a config when path is not provided', () => {
    const spyCwd = jest.spyOn(process, 'cwd')
    spyCwd.mockReturnValue(path.resolve('test/fixtures'))

    config = new IconsauceConfig()
  })
  test('should loads a esm config when path is not provided', () => {
    const spyCwd = jest.spyOn(process, 'cwd')
    spyCwd.mockReturnValue(path.resolve('test/fixtures/esm'))

    config = new IconsauceConfig()
  })
  test('should loads a esm config when path is not provided', () => {
    expect(false).toBeTruthy()
  })
})

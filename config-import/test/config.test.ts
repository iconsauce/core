import { IconsauceConfig } from '../src/index'
import { Config } from '../src/interface/config'
import path from 'path'
import { configTest } from './fixtures/config'

describe('IconsauceConfig', () => {
  test('Check IconsauceConfig loads a config', () => {
    const config: Config = new IconsauceConfig(path.resolve(__dirname, './fixtures/iconsauce.config.js'))
    expect(config.content).toEqual(configTest.content)
    expect(config.fontFamily).toEqual(configTest.fontFamily)
    expect(config.fontSize).toEqual(configTest.fontSize)
    expect(config.skipWarnings).toEqual(configTest.skipWarnings)
    expect(config.verbose).toEqual(configTest.verbose)
    expect(config.plugin.length).toEqual(configTest.plugin.length)
  })
})

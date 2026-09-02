import { IconsauceConfig } from '../src/config'
import { type Config } from '../src/config/interface/config'
import path from 'path'
import { configTest } from './fixtures/config'

describe('Config', () => {
  test('Check IconsauceConfig loads a config', async () => {
    const config: Config = await new IconsauceConfig().loadConfig(path.resolve(__dirname, './fixtures/iconsauce.config.js'))
    expect(config.center).toEqual(configTest.center)
    expect(config.content).toEqual(configTest.content)
    expect(config.fontFamily).toEqual(configTest.fontFamily)
    expect(config.fontSize).toEqual(configTest.fontSize)
    expect(config.skipWarnings).toEqual(configTest.skipWarnings)
    expect(config.verbose).toEqual(configTest.verbose)
    expect(config.plugin.length).toEqual(configTest.plugin.length)
    expect(config.plugin[0].path).toEqual(configTest.plugin[0].path)
  })
})

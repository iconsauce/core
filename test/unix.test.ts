import { IconsauceConfig } from '../src/config'
import path from 'path'
import { configTest } from './fixtures/config-loader/config'

jest.mock('../src/config/utils', () => ({
  ...jest.requireActual<typeof import('../src/config/utils')>('../src/config/utils'),
  ISUNIX: true,
}))

describe('IconsauceConfig on unix systems', () => {
  test('should normalize content and plugin paths', async () => {
    const config = await new IconsauceConfig().loadConfig(path.resolve(__dirname, './fixtures/config-loader/iconsauce.config.js'))
    expect(config.content).toEqual(configTest.content)
    expect(config.plugin.length).toEqual(configTest.plugin.length)
    config.plugin.forEach(plug => {
      expect(plug.path.toString()).not.toContain('\\\\')
      expect(plug.regex.lib).toBeInstanceOf(RegExp)
    })
  })
})

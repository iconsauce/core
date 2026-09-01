import { IconsauceConfig } from '../src/index'
import path from 'path'
import { configTest } from './fixtures/config'

jest.mock('../src/utils', () => ({
  ...jest.requireActual<typeof import('../src/utils')>('../src/utils'),
  ISUNIX: true,
}))

describe('IconsauceConfig on unix systems', () => {
  test('should normalize content and plugin paths', async () => {
    const config = await new IconsauceConfig().loadConfig(path.resolve(__dirname, './fixtures/iconsauce.config.js'))
    expect(config.content).toEqual(configTest.content)
    expect(config.plugin.length).toEqual(configTest.plugin.length)
    config.plugin.forEach(plug => {
      expect(plug.path.toString()).not.toContain('\\\\')
      expect(plug.regex.lib).toBeInstanceOf(RegExp)
    })
  })
})

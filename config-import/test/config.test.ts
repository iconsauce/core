import { IconsauceConfig } from '../src/index'
import { Config } from '../src/interface/config'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { configTest } from './fixtures/config'

describe('IconsauceConfig', () => {
  let config: Config

  afterEach(() => {
    expect(config).toBeTruthy()
    expect(config.content).toEqual(configTest.content)
    expect(config.fontFamily).toEqual(configTest.fontFamily)
    expect(config.fontSize).toEqual(configTest.fontSize)
    expect(config.skipWarnings).toEqual(configTest.skipWarnings)
    expect(config.verbose).toEqual(configTest.verbose)
    expect(config.plugin.length).toEqual(configTest.plugin.length)

  })
  test('should loads a config when path setted', async () => {
    config = await new IconsauceConfig().loadConfig(path.resolve(__dirname, './fixtures/iconsauce.config.js'))
  })
  test('should loads a config when path is not provided', async () => {
    const spyCwd = jest.spyOn(process, 'cwd')
    spyCwd.mockReturnValue(path.resolve('test/fixtures'))

    config = await new IconsauceConfig().loadConfig()
  })
  test('should loads a esm config when path is not provided', async () => {
    const spyCwd = jest.spyOn(process, 'cwd')
    spyCwd.mockReturnValue(path.resolve('test/fixtures/esm'))
    config = await new IconsauceConfig().loadConfig()
  })
})

describe('IconsauceConfig errors', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })
  test('should throw when configuration file is not found', async () => {
    const emptyDir = fs.mkdtempSync(path.join(os.tmpdir(), 'iconsauce-'))
    jest.spyOn(process, 'cwd').mockReturnValue(emptyDir)
    await expect(new IconsauceConfig().loadConfig())
      .rejects.toThrow('Iconsauce configuration file not found')
  })
  test('should throw when "content" property is empty', async () => {
    await expect(new IconsauceConfig().loadConfig(path.resolve(__dirname, './fixtures/empty-content/iconsauce.config.js')))
      .rejects.toThrow('Missing required "content" property')
  })
})

describe('IconsauceConfig overrides', () => {
  test('should override all defaults with values from config file', async () => {
    const config = await new IconsauceConfig().loadConfig(path.resolve(__dirname, './fixtures/full/iconsauce.config.js'))
    expect(config.center).toBe(true)
    expect(config.content).toEqual(['./lib/**/*.{tsx,ts}'])
    expect(config.fontFamily).toBe('custom-font')
    expect(config.fontSize).toBe('32px')
    expect(config.plugin.length).toBe(1)
    expect(config.skipWarnings).toBe(false)
    expect(config.verbose).toBe(true)
  })
  test('should apply constructor arguments over defaults', () => {
    const config = new IconsauceConfig(false, true)
    expect(config.skipWarnings).toBe(false)
    expect(config.verbose).toBe(true)
  })
  test('should fall back to default plugins when plugin property is missing', async () => {
    const config = await new IconsauceConfig().loadConfig(path.resolve(__dirname, './fixtures/empty-plugin/iconsauce.config.js'))
    expect(config.plugin.length).toEqual(configTest.plugin.length)
    expect(config.content).toEqual(['./src/**/*.{tsx,ts}'])
  })
})

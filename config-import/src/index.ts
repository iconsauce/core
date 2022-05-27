import chalk from 'chalk'
import { IconsaucePlugin } from '@iconsauce/plugin'
import { lilconfigSync } from 'lilconfig'
import { Config } from './interface/config'
import { DEFAULT_CONFIG_PATH, ISUNIX, PROJECT_NAME, PROJECT_PATH } from './utils'
import maggioliSvgIconsPlugin from '@iconsauce/mgg-icons'
import materialIconsPlugin from '@iconsauce/material-icons'
import mdiSvgPlugin from '@iconsauce/mdi-svg'

const defaultConfig: Config = {
  center: false,
  content: [],
  fontFamily: 'iconsauce',
  fontSize: '24px',
  plugin: [
    materialIconsPlugin,
    mdiSvgPlugin,
    maggioliSvgIconsPlugin,
  ],
  skipWarnings: true,
  verbose: false,
}

export class IconsauceConfig implements Config {
  center: boolean
  content: string[]
  fontFamily: string
  fontSize: string
  plugin: IconsaucePlugin[]
  skipWarnings: boolean
  verbose: boolean

  constructor (configPath?: string, skipWarnings?: boolean, verbose?: boolean) {
    const config = fixConfigCompatibilityOS(loadConfig(configPath))

    if (config.content.length === 0) {
      throw new Error(chalk.red('Missing required "content" property'))
    }
    this.center = config.center ?? defaultConfig.center
    this.content = config.content
    this.fontFamily = defaultConfig.fontFamily
    this.fontSize = config.fontSize ?? defaultConfig.fontSize
    this.plugin = config.plugin ?? defaultConfig.plugin
    this.skipWarnings = config.verbose ?? skipWarnings ?? defaultConfig.skipWarnings
    this.verbose = config.verbose ?? verbose ?? defaultConfig.verbose
  }
}

const loadConfig = (configPath?: string) : Config => {
  const options = {
    searchPlaces: [PROJECT_PATH],
    ignoreEmptySearchPlaces: false,
  }
  try {
    return lilconfigSync(PROJECT_NAME, options).load(configPath ?? DEFAULT_CONFIG_PATH)?.config as Config
  } catch (error) {
    throw new Error(chalk.red(error))
  }
}

const fixConfigCompatibilityOS = (config: Config): Config => {
  if (ISUNIX) {
    config.content = config.content.map(p => p.replaceAll('\\\\', '\\/'))
    const plugin = config.plugin.map(plug => {
      return { ...plug,
        path: plug.path.toString().replaceAll('\\\\', '\\/'),
        lib: new RegExp(plug.regex.lib.source.replaceAll('\\\\', '\\/')),
      }
    })
    config.plugin = plugin
  } else {
    const plugin = config.plugin.map(plug => {
      return { ...plug,
        path: plug.path.toString().replaceAll('\\', '/'),
      }
    })
    config.plugin = plugin
  }
  return config
}

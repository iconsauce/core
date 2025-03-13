import chalk from 'chalk'
import { IconsaucePlugin } from '@iconsauce/plugin'
import {
  lilconfig,
  LilconfigResult,
  OptionsSync,
} from 'lilconfig'
import { Config } from './interface/config'
import { ISUNIX, PROJECT_NAME } from './utils'
import maggioliSvgIconsPlugin from '@iconsauce/mgg-icons'
import materialIconsPlugin from '@iconsauce/material-icons'
import mdiSvgPlugin from '@iconsauce/mdi-svg'

const defaultConfig: Config = {
  center: false,
  content: [],
  fontFamily: 'iconsauce',
  fontSize: '24px',
  plugin: [materialIconsPlugin, mdiSvgPlugin, maggioliSvgIconsPlugin],
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

  constructor (skipWarnings?: boolean, verbose?: boolean) {
    this.center = defaultConfig.center
    this.content = defaultConfig.content
    this.fontFamily = defaultConfig.fontFamily
    this.fontSize = defaultConfig.fontSize
    this.plugin = defaultConfig.plugin
    this.skipWarnings = skipWarnings ?? defaultConfig.skipWarnings
    this.verbose = verbose ?? defaultConfig.verbose
  }

  loadConfig (configPath?: string): Promise<Config> {
    return this.load(configPath)
      .then(lilResult => {
        if (!lilResult) throw new Error(chalk.red('Iconsauce configuration file not found'))
        // if load config as esm the configuration object is in config.default
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (lilResult.config.default) return lilResult.config.default as Config
        return lilResult.config as Config
      })
      .then(c => {
        if (c.content.length === 0) {
          throw new Error(chalk.red('Missing required "content" property'))
        }
        const config = this.fixConfigCompatibilityOS(c)
        this.center = config.center ?? this.center
        this.content = config.content
        this.fontFamily = config.fontFamily ?? defaultConfig.fontFamily
        this.fontSize = config.fontSize ?? this.fontSize
        this.plugin = config.plugin ?? this.plugin
        this.skipWarnings = config.skipWarnings ?? this.skipWarnings
        this.verbose = config.verbose ?? this.verbose
        return this
      })
  }

  private load (configPath?: string): Promise<LilconfigResult> {
    const options: OptionsSync = {
      ignoreEmptySearchPlaces: false,
    }
    if (configPath) {
      return lilconfig(PROJECT_NAME, options).load(configPath)
    }
    return lilconfig('iconsauce', options).search()
  }

  private fixConfigCompatibilityOS (config: Config): Config {
    if (ISUNIX) {
      config.content = config.content.map(p => p.replaceAll('\\\\', '\\/'))
      const plugin = config.plugin.map(plug => {
        return {
          ...plug,
          path: plug.path.toString().replaceAll('\\\\', '\\/'),
          lib: new RegExp(plug.regex.lib.source.replaceAll('\\\\', '\\/')),
        }
      })
      config.plugin = plugin
    } else {
      const plugin = config.plugin.map(plug => {
        return { ...plug, path: plug.path.toString().replaceAll('\\', '/') }
      })
      config.plugin = plugin
    }
    return config
  }
}

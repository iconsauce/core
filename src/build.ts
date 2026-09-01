import fg from 'fast-glob'
import chalk from 'chalk'
import { type PathLike } from 'fs'
import { occurrences } from './lib/occurrences'
import { icons } from './lib/icons'
import { filter } from './lib/filter'
import { IconsauceConfig } from './config'
import { type Config } from './config/interface/config'

const build = async (configuration?: Config): Promise<{ dictionary: Map<string, PathLike>, list: Map<string, PathLike> } | undefined> => {
  const config: Config = configuration ?? new IconsauceConfig()

  if (config.verbose) {
    console.info('Preparing assets and data')
  }
  const iconDictionary = await icons(config)

  if (iconDictionary.size === 0) {
    if (config.verbose) {
      if (config.skipWarnings) {
        console.info(`${chalk.yellow('Warning:')} No icons found in ${chalk.yellow('plugin paths')}, skipping iconsauce build`)
      } else {
        throw Error(`No icons found in ${chalk.red('plugin paths')}, stopping iconsauce build`)
      }
    }
    return
  }

  const files = await fg(config.content)
  const selectors = await occurrences(config, files)
  const iconList = filter(config, iconDictionary, selectors)

  if (config.verbose) {
    const relativeSize = iconDictionary.size - selectors.map.size
    const fraction = relativeSize / iconDictionary.size
    console.info(`The bundle is ${chalk.green(`${(fraction * 100).toFixed(4)}%`)} smaller than the entire ${config.plugin.length === 1 ? 'icon library' : `${config.plugin.length} libraries together`}`)
  }

  if (iconList.size === 0) {
    if (config.verbose) {
      console.info('No icons found in your code yet, skipping iconsauce CSS icon font creation')
    }
  }

  return {
    dictionary: iconDictionary,
    list: iconList,
  }
}

export {
  build,
}

import fg from 'fast-glob'
import chalk from 'chalk'
import { type IconsaucePlugin } from '@iconsauce/plugin'
import { type Config } from '../config/interface/config'
import { type PathLike } from 'fs'

const dictionary = (plugin: IconsaucePlugin, icons: PathLike[]) => {
  const iconsDictionary = new Map<string, PathLike>()
  let icon
  for (icon of icons) {
    const iconPath = icon.toString().match(plugin.regex.lib)!
    if (iconPath === null) {
      throw Error(`${chalk.red('IconsaucePlugin regex.lib not matching icons for the path')} ${icon.toString()}`)
    }
    iconsDictionary.set(plugin.selector(iconPath).toLowerCase(), icon)
  }
  return iconsDictionary
}

const icons = async (config: Config): Promise<Map<string, PathLike>> => {
  let pluginItem
  let iconsDictionary = new Map<string, PathLike>()
  for (pluginItem of config.plugin) {
    const entries = await fg(pluginItem.path.toString(), { dot: true })
    const newIcons = dictionary(pluginItem, entries)
    iconsDictionary = new Map([ ...iconsDictionary, ...newIcons ])
  }

  if (config.verbose) {
    console.info(`Found ${chalk.green(iconsDictionary.size)} icons from ${chalk.green(config.plugin.length)} ${config.plugin.length === 1 ? 'library' : 'libraries'}`)
  }

  return iconsDictionary
}

export {
  icons,
}

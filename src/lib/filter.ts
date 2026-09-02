import chalk from 'chalk'
import { type PathLike } from 'fs'
import { type Config } from '../config/interface/config'

const filter = (config: Config, dictionary: Map<string, PathLike>, selectors: {occurrences: string[], map: Map<string, PathLike>}): Map<string, PathLike> => {
  let occurrence
  const filteredDictionary = new Map<string, string>()
  for (occurrence of selectors.occurrences) {
    if (dictionary.get(occurrence) !== undefined) {
      filteredDictionary.set(occurrence, dictionary.get(occurrence) as string)
    } else {
      if (config.skipWarnings) {
        console.info(`${chalk.yellow('Warning:')} ${chalk.yellow(occurrence)} from ${chalk.blue(selectors.map.get(occurrence))} not found `)
      } else {
        throw Error(`${chalk.red(occurrence)} from ${chalk.blue(selectors.map.get(occurrence))} not found`)
      }
    }
  }
  return filteredDictionary
}

export {
  filter,
}

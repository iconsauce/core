import { readFile } from 'fs/promises'
import chalk from 'chalk'
import { type Config } from '../config/interface/config'
import { type PathLike } from 'fs'

const occurrences = async (config: Config, files: PathLike[]): Promise<{ occurrences: string[], map: Map<string, PathLike> }> => {
  let pluginItem
  let inputIcons: string[] = []
  const filesMap = new Map<string, PathLike>()
  let selector

  for (const file of files) {
    const fileContent = await readFile(file, 'utf8').catch(error => {
      throw new Error(chalk.red(error))
    })
    for (pluginItem of config.plugin) {
      const selectors = fileContent.match(pluginItem.regex.code)
      if (selectors !== null) {
        for (selector of selectors) {
          filesMap.set(selector, file)
        }
        inputIcons = [...new Set([...inputIcons, ...selectors])]
      }
    }
  }

  if (config.verbose) {
    console.info(`Found ${chalk.green(inputIcons.length)} unique ${inputIcons.length === 1 ? 'selector' : 'selectors'} from ${chalk.green(files.length)} ${files.length === 1 ? 'file' : 'files'}`)
  }

  return {
    occurrences: inputIcons.sort(),
    map: filesMap,
  }
}

export {
  occurrences,
}

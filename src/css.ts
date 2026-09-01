import chalk from 'chalk'
import { type PathLike } from 'fs'
import { fontBase64 } from './lib/font'
import { css } from './lib/css'
import { type Config } from './config/interface/config'

const buildCSS = async (config: Config, list: Map<string, PathLike>): Promise<string> => {
  if (list.size === 0) {
    console.info(`${chalk.blue('No selectors found')}, the output CSS is empty`)
    return ''
  }
  const { base64font, dictionary } = await fontBase64(config, list)
  const cssData = css(config, base64font, dictionary)

  if (config.verbose) {
    console.info(`CSS build finished ${chalk.green('successfully')}`)
  }

  return cssData
}

export {
  buildCSS,
}

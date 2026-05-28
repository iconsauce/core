#!/usr/bin/env node
import arg from 'arg'
import chalk from 'chalk'
import { type PathLike } from 'fs'
import { writeFile } from 'fs/promises'
import { IconsauceConfig } from '@iconsauce/config'
import { build } from './build'
import { buildCSS } from './index'
import { name, version } from '../package.json'
import { type Config } from '@iconsauce/config/lib/interface/config'
import { checkFilePath, exportMap, exportSVG } from './lib/utils'
let configPath = undefined

const args = arg({
  '--config': String,
  '--output-css': String,
  '--output-dictionary': String,
  '--output-svg': String,
  '--output-dump-svg': String,
  '--output-dump-dictionary': String,
  '--skip-warnings': Boolean,
  '--verbose': Boolean,
  '-c': '--config',
  '-oc': '--output-css',
  '-od': '--output-dictionary',
  '-os': '--output-svg',
  '-ods': '--output-dump-svg',
  '-odd': '--output-dump-dictionary',
  '-s': '--skip-warnings',
  '-v': '--verbose',
})

if (args['--config']) {
  configPath = args['--config']
}

args['--skip-warnings'] ??= true

args['--verbose'] ??= false

function loadConfig (configPath: string | undefined): Promise<Config> {
  return new IconsauceConfig(args['--skip-warnings'], args['--verbose']).loadConfig(configPath)
}

console.info(chalk.cyan(name))
console.info(chalk.cyan(`v${String(version)}`))

loadConfig(configPath).then(config =>
  build(config).then((data: { dictionary: Map<string, PathLike>, list: Map<string, PathLike> } | undefined) => {
    if (data === undefined) {
      return
    }

    if (args['--output-dump-svg'] !== undefined) {
      exportSVG(data.dictionary, args['--output-dump-svg'], config.verbose)
        .catch(console.error)
    }

    if (args['--output-dump-dictionary'] !== undefined) {
      exportMap(data.dictionary, args['--output-dump-dictionary'], config.verbose)
        .catch(console.error)
    }

    if (args['--output-dictionary'] !== undefined) {
      exportMap(data.list, args['--output-dictionary'], config.verbose)
        .catch(console.error)
    }

    if (args['--output-svg'] !== undefined) {
      exportSVG(data.list, args['--output-svg'], config.verbose).catch(console.error)
    }

    if (args['--output-css'] !== undefined) {
      checkFilePath(args['--output-css'])
        .then(() => buildCSS(config, data.list))
        .then((data: string) => writeFile(args['--output-css'] as PathLike, data))
        .catch(console.error)
    }
  }).catch(console.error),
).catch(console.error)

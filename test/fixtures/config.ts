import { type Config } from '../../src/config/interface/config'
import { ISUNIX } from '../../src/config/utils'
import materialIconsPlugin from '@iconsauce/material-icons'
import mdiSvgPlugin from '@iconsauce/mdi-svg'
import maggioliSvgIconsPlugin from '@iconsauce/mgg-icons'

const c: Config = {
  center: false,
  content: [
    './src/**/*.{tsx,ts}',
  ],
  fontSize : '24px',
  fontFamily : 'iconsauce',
  plugin: [
    materialIconsPlugin,
    mdiSvgPlugin,
    maggioliSvgIconsPlugin,
  ],
  verbose : false,
  skipWarnings : true,
}

// fix compatibility OS for test environment
export const configTest = fixConfigCompatibilityOS(c)

function fixConfigCompatibilityOS (config: Config): Config {
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
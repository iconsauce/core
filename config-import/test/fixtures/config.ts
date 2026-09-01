import { Config } from '../../src/interface/config'
import materialIconsPlugin from '@iconsauce/material-icons'
import mdiSvgPlugin from '@iconsauce/mdi-svg'
import maggioliSvgIconsPlugin from '@iconsauce/mgg-icons'

export const configTest: Config = {
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



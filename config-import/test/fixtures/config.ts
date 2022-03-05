import { Config } from '../../src/interface/config'
import materialDesignIconsUpdatedPlugin from '@iconsauce/material-design-icons-updated'
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
    materialDesignIconsUpdatedPlugin,
    mdiSvgPlugin,
    maggioliSvgIconsPlugin,
  ],
  verbose : false,
  skipWarnings : true,
}



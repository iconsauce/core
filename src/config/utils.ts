import path from 'path'

const PROJECT_NAME = 'iconsauce'
const PROJECT_PATH = path.join('.')
const DEFAULT_CONFIG_PATH = path.join(PROJECT_PATH, 'iconsauce.config.js')
const ISUNIX = path.sep === '/'

export {
  PROJECT_NAME,
  PROJECT_PATH,
  DEFAULT_CONFIG_PATH,
  ISUNIX,
}

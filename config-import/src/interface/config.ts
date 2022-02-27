import { IconsaucePlugin } from '@iconsauce/plugin'
import { PathLike } from 'fs'

export interface Config {
  content: string[]
  dictionary?: PathLike
  fontFamily: string
  fontSize: string
  plugin: IconsaucePlugin[]
  skipWarnings: boolean
  verbose: boolean
}

import { IconsaucePlugin } from '@iconsauce/plugin'

export interface Config {
  center: boolean
  content: string[]
  fontFamily: string
  fontSize: string
  plugin: IconsaucePlugin[]
  skipWarnings: boolean
  verbose: boolean
}

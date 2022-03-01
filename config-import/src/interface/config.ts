import { IconsaucePlugin } from '@iconsauce/plugin'

export interface Config {
  content: string[]
  fontFamily: string
  fontSize: string
  plugin: IconsaucePlugin[]
  skipWarnings: boolean
  verbose: boolean
}

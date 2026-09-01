import { type PathLike } from 'fs'
import handlebars, { type HelperOptions } from 'handlebars'
import { type Config } from '../config/interface/config'

const template = handlebars.compile(`@font-face {
  font-family: "{{fontFamily}}";
  src: url("data:font/truetype;charset=utf-8;base64,{{{fontBase64}}}") format("truetype");
}

{{#each classPrefixes}}[class^="{{this}}/"], [class*=" {{this}}/"]{{#if @last}}{{else}}, {{/if}}{{/each}} {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  font-family: "{{fontFamily}}" !important;
  font-size: {{fontSize}};
  font-style: normal;
  font-weight: 400;
  line-height: 1;
}

{{#eachInMap selectors}}
{{iconselector key value }}
{{/eachInMap}}
`)

handlebars.registerHelper('iconselector', (key: string, value: string) => {
  return new handlebars.SafeString(`.${key.replace(/\//g, '\\/')}::before { content: "\\${value.codePointAt(0)?.toString(16)}" }`)
})

handlebars.registerHelper('eachInMap', (map: Map<string, PathLike>, block: HelperOptions ) => {
  let out = ''
  for (const key of map.keys()){
    out += block.fn({ key, value: map.get(key) })
  }
  return out
})

/**
 *
 * @param config Configuration context
 * @param base64font encoded font
 * @param dictionary a map where key is selector and the value is unicode string
 * @returns css formatted file as a string
 */
const css = (config: Config, base64font: string, dictionary: Map<string, string>): string => {
  const prefixes = new Set()

  for (const key of dictionary.keys()) {
    prefixes.add(key.toString().split('/')[0])
  }
  const cssString = template({
    fontBase64: base64font,
    classPrefixes: prefixes,
    fontFamily: config.fontFamily,
    fontSize: config.fontSize,
    selectors: dictionary,
  })

  return cssString
}

export {
  css,
}

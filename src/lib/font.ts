import chalk from 'chalk'
import { createReadStream, createWriteStream, type PathLike, type ReadStream } from 'fs'
import { mkdir, readFile } from 'fs/promises'
import path from 'path'
// import svg2ttf from 'svg2ttf'
import { Font } from 'fonteditor-core'
import { SVGIcons2SVGFontStream } from 'svgicons2svgfont'
import { type Config } from '../config/interface/config'
import { PROJECT_NAME, TEMP_PATH } from './utils'

interface Glyph extends ReadStream {
  metadata: {
    name: string
    unicode: [string]
  }
}

const TEMP_FONT_PATH = path.join(TEMP_PATH, `font${path.sep}`)
const TEMP_FONT_PATH_SVG = path.join(TEMP_FONT_PATH, `${path.sep}${PROJECT_NAME}.svg`)

const fontBase64 = async (config: Config, icons: Map<string, PathLike>): Promise<{ base64font: string, dictionary: Map<string, string> }> => {
  await mkdir(TEMP_FONT_PATH, { recursive: true })
    .catch(console.error)
  let startUnicode = 0xea01

  return new Promise(( resolve, reject) => {
    if (icons.size === 0) {
      reject(new Error(chalk.red('Icons map cannot be empty')))
      return
    }
    const fontStream = new SVGIcons2SVGFontStream({
      centerHorizontally: config.center,
      centerVertically: config.center,
      fixedWidth: true,
      fontHeight: 2048,
      fontName: config.fontFamily,
      fontStyle: 'normal',
      fontWeight: 400,
      normalize: false,
    })

    const dictionary = new Map<string, string>()

    for (const iconSelector of icons.keys()) {
      const glyph = createReadStream(path.resolve(icons.get(iconSelector) as string)) as Glyph
      const unicode = String.fromCharCode(startUnicode)
      startUnicode += 1
      glyph.metadata = {
        name: iconSelector,
        unicode: [unicode],
      }
      dictionary.set(iconSelector, unicode)
      fontStream.write(glyph)
    }

    fontStream
      .pipe(createWriteStream(TEMP_FONT_PATH_SVG)
        .on('finish', () => {
          fontTottf().then(base64FontGenerated => {
            const base64font = base64FontGenerated.replaceAll(/[=]{1,}$/g, '')
            resolve({ base64font, dictionary })
          }).catch(err => {
            console.log(err)
          })
        })
        .on('error', err => {
          throw new Error(chalk.red(err))
        }),
      )
    fontStream.end()
  })
}

const fontTottf = async () => {
  const svgContent = await readFile(TEMP_FONT_PATH_SVG, 'utf8')

  // Creo l'oggetto Font caricando l'SVG
  const font = Font.create(svgContent, {
    type: 'svg',
  })

  // Scrivo il font in formato TTF (restituisce un Buffer)
  const ttfBuffer = font.write({
    type: 'ttf',
  }) as Buffer

  return ttfBuffer.toString('base64')
}

export {
  fontBase64,
}

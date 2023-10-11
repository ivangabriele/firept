import { load as cheerioLoad } from 'cheerio'
import got from 'got'
import TurndownService from 'turndown'
// @ts-ignore
import turndownPluginGfm from 'turndown-plugin-gfm'

const turndownService = new TurndownService({
  bulletListMarker: '-',
  codeBlockStyle: 'fenced',
  headingStyle: 'atx',
})
turndownService.use(turndownPluginGfm.gfm)

export async function fetchWeb(url: string): Promise<string | null> {
  try {
    const sourceAsHtml = await got.get(url).text()

    const $ = cheerioLoad(sourceAsHtml)
    $('head').remove()
    $('body').each(function () {
      $(this).find('audio').remove()
      $(this).find('button').remove()
      $(this).find('footer').remove()
      $(this).find('img').remove()
      $(this).find('picture').remove()
      $(this).find('style').remove()
      $(this).find('template').remove()
      $(this).find('video').remove()

      // Anchors
      $(this)
        .find('a')
        .each(function () {
          if ($(this).attr('href')?.startsWith('#')) {
            $(this).remove()
          }
        })

      $(this).find('br').replaceWith(' ')

      if (url.includes('github.com')) {
        $(this)
          .find('script[data-target="react-app.embeddedData"]')
          .each(function () {
            const embeddedData = JSON.parse($(this).text())

            if (embeddedData?.payload?.blob?.rawLines) {
              const sourceCode = embeddedData.payload.blob.rawLines.join('\n')

              $(this).replaceWith($('<pre>').append($('<code>').text(sourceCode)))
            }
          })

        $(this)
          .find('table')
          .each(function () {
            if ($(this).data('hpc') !== undefined) {
              let sourceCode = ''
              $(this)
                .find('tbody tr')
                .each(function () {
                  const codeLine = $(this).find('td.blob-code').text()
                  sourceCode += codeLine + '\n'
                })

              $(this).replaceWith($('<pre>').append($('<code>').text(sourceCode)))
            }
          })
      }

      $(this).find('script').remove()
    })

    const sourceAsMarkdown = turndownService
      .turndown($.html())
      .replace(/\[\s*\]\([^)]*\)/g, '')
      .replace(/\[[\n\s]*(.*)[\n\s]*\]\(([^)]*)\)/g, '[$1]($2)')
      .replace(/^-\s{2,}/gm, '- ')
      .replace(/\n{2,}/gm, '\n\n')
      // Github
      .replace('You can’t perform that action at this time.', '')
      .trim()

    return sourceAsMarkdown
  } catch (error) {
    console.error(`Error fetching or converting web page: ${error}`)
    return null
  }
}

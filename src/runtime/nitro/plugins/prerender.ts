import { appendHeader } from 'h3'
import { joinURL } from 'ufo'
import type { NitroAppPlugin } from 'nitropack'
import { extractOgImageOptions } from '../utils-pure'
import { useRuntimeConfig } from '#imports'

const OgImagePrenderNitroPlugin: NitroAppPlugin = (nitroApp) => {
  if (!process.env.prerender)
    return

  const { forcePrerender } = useRuntimeConfig()['nuxt-og-image']
  nitroApp.hooks.hook('render:html', async (ctx, { event }) => {
    const url = event.node.req.url!
    if (url.includes('.') || url.startsWith('/__nuxt_island/'))
      return
    const options = extractOgImageOptions(ctx.head.join('\n'))
    if (!options)
      return
    if ((forcePrerender || options.static) && options.provider === 'satori')
      appendHeader(event, 'x-nitro-prerender', joinURL(url, '/__og_image__/og.png'))
  })
}

export default OgImagePrenderNitroPlugin

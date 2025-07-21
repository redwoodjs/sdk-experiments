import { defineApp, renderToStream } from 'rwsdk/worker'
import { env } from 'cloudflare:workers'
import { realtimeRoute } from 'rwsdk/realtime/worker'
import { render, route } from 'rwsdk/router'
import { Document } from './app/Document'
import { Page } from './app/Page'
import { NotFound } from './app/NotFound'

export { RealtimeDurableObject } from 'rwsdk/realtime/durableObject'

export type AppContext = {}

const app = defineApp([
  realtimeRoute(() => env.REALTIME_DURABLE_OBJECT),
  async ({ request }) => {
    const url = new URL(request.url)
    const should404 = url.searchParams.get('404')

    if (should404) {
      url.searchParams.delete('404')
      console.log('######### Responding with 404')
      return new Response(await renderToStream(<NotFound />), { status: 404 })
    }
  },
  render(Document, [route('*', Page)])
])

export default {
  fetch: app.fetch
}

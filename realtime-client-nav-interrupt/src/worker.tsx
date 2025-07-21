import { defineApp } from 'rwsdk/worker'
import { env } from 'cloudflare:workers'
import { realtimeRoute } from 'rwsdk/realtime/worker'
import { render, route } from 'rwsdk/router'
import { Document } from './app/Document'
import { Page } from './app/Page'

export { RealtimeDurableObject } from 'rwsdk/realtime/durableObject'

export type AppContext = {}

const app = defineApp([
  realtimeRoute(() => env.REALTIME_DURABLE_OBJECT),
  ({ request }) => {
    const url = new URL(request.url)
    const redirect = url.searchParams.get('redirect')

    if (redirect) {
      return Response.redirect(redirect, 302)
    }
  },
  render(Document, [route('*', Page)])
])

export default {
  fetch: app.fetch
}

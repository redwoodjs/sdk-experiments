'use server'
import { renderRealtimeClients } from 'rwsdk/realtime/worker'
import { env } from 'cloudflare:workers'

export async function renderClients() {
  await renderRealtimeClients({
    durableObjectNamespace: env.REALTIME_DURABLE_OBJECT,
    key: 'rwsdk-realtime'
  })
}

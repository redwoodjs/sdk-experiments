import { requestInfo as r } from 'rwsdk/worker'
import { Layout } from './Layout'
import { Url } from './Url'
import { Headers } from './Headers'
import { Params } from './Params'
import { IsDev } from './IsDev'

async function sleep(s: number) {
  return new Promise(resolve => setTimeout(resolve, s * 1000))
}

export async function Page() {
  const url = new URL(r.request.url)
  const sleepTime = Number(url.searchParams.get('sleep'))
  if (sleepTime > 0) {
    await sleep(sleepTime)
  }
  const pathname = new URL(r.request.url).pathname
  const pages: Record<string, string> = {
    '/': 'Home',
    '/about': 'About',
    '/test': 'Test'
  }
  const title = pages[pathname] || pathname

  return (
    <Layout>
      <title>{title + ' minimal-rwsdk-rsc'}</title>
      <div className="m-3">
        <h1 className="text-center text-2xl font-bold border-b border-gray-200 mb-2">{title}</h1>
        {sleepTime > 0 && <p>Sleeping {sleepTime} seconds</p>}
        <p>This is a server component</p>
        <p>{new Date().toISOString()}</p>
        <Url />
        <IsDev />
        <Params />
        <Headers />
      </div>
    </Layout>
  )
}

const url = new URL(window.location.href)

const isRealtime = url.searchParams.has('realtime')
const isSpa = url.searchParams.has('spa')

async function initFetchSpa() {
  const { initClientNavigation, initClient } = await import('rwsdk/client')
  initClient(initClientNavigation())
}

async function initFetchRsc() {
  const { initClient } = await import('rwsdk/client')
  initClient()
}

async function initRealtimeSpa() {
  const { initRealtimeClient } = await import('rwsdk/realtime/client')
  const { initClientNavigation } = await import('rwsdk/client')

  initRealtimeClient({
    key: 'rwsdk-realtime',
    ...initClientNavigation()
  })
}

async function initRealtimeRsc() {
  const { initRealtimeClient } = await import('rwsdk/realtime/client')

  initRealtimeClient({
    key: 'rwsdk-realtime'
  })
}

if (isRealtime && isSpa) {
  initRealtimeSpa()
} else if (isRealtime) {
  initRealtimeRsc()
} else if (isSpa) {
  initFetchSpa()
} else {
  initFetchRsc()
}

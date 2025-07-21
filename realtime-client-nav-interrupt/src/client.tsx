import { initClient, initClientNavigation } from 'rwsdk/client'
import { initRealtimeClient } from 'rwsdk/realtime/client'

const url = new URL(window.location.href)

if (url.searchParams.has('realtime')) {
  initRealtimeClient({ key: 'rwsdk-realtime' })
  console.log('realtime RSC')
} else {
  initClient()
  console.log('normal RSC')
}

if (url.searchParams.has('spa')) {
  initClientNavigation()
  console.log('client-side navigation')
} else {
  console.log('normal navigation')
}

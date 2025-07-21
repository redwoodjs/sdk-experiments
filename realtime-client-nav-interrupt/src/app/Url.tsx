import { requestInfo as r } from 'rwsdk/worker'

export async function Url() {
  return (
    <p>
      <b>r.request.url</b>: {r.request.url}
    </p>
  )
}
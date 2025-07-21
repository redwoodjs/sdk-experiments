import { requestInfo as r } from 'rwsdk/worker'

export function Headers() {
  return (
    <p className="whitespace-pre-line">
      <b>r.request.headers</b>: {JSON.stringify(Object.fromEntries(r.request.headers), null, 2)}
    </p>
  )
}

import { requestInfo as r } from 'rwsdk/worker'

export function Params() {
  return (
    <p className="whitespace-pre-line">
      <b>r.params</b>: {JSON.stringify(r.params, null, 2)}
    </p>
  )
}
import { IS_DEV } from 'rwsdk/constants'

export function IsDev() {
  return (
    <p>
      <b>IS_DEV</b>: {IS_DEV ? 'true' : 'false'}
    </p>
  )
}

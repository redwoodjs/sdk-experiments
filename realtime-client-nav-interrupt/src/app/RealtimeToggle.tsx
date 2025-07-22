'use client'

export function RealtimeToggle({ isRealtimeMode }: { isRealtimeMode: boolean }) {
  function navigateOnChange() {
    const url = new URL(window.location.href)
    if (isRealtimeMode) {
      url.searchParams.delete('realtime')
    } else {
      url.searchParams.set('realtime', '')
    }
    window.location.href = url.toString()
  }

  // https://daisyui.com/components/toggle/
  return (
    <label
      title="Toggle Realtime mode"
      className={`${isRealtimeMode ? 'text-green-700 hover:text-green-600' : 'text-gray-400 hover:text-gray-500'} flex items-center cursor-pointer`}
    >
      <input
        type="checkbox"
        id="realtime-toggle"
        checked={isRealtimeMode}
        onChange={navigateOnChange}
        className="toggle toggle-success mr-1"
      />
      Realtime
    </label>
  )
}

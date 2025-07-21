'use client'

export function SpaModeToggle({ isSpaMode }: { isSpaMode: boolean }) {
  function navigateOnChange() {
    const url = new URL(window.location.href)
    if (isSpaMode) {
      url.searchParams.delete('spa')
    } else {
      url.searchParams.set('spa', '')
    }
    window.location.href = url.toString()
  }

  // https://daisyui.com/components/toggle/
  return (
    <label
      title="Toggle SPA mode"
      className={`${isSpaMode ? 'text-green-700 hover:text-green-600' : 'text-gray-400 hover:text-gray-500'} flex items-center cursor-pointer`}
    >
      <input
        type="checkbox"
        id="spa-toggle"
        checked={isSpaMode}
        onChange={navigateOnChange}
        className="toggle toggle-success mr-1"
      />
      SPA
    </label>
  )
}

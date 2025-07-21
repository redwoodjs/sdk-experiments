import { Nav } from './Nav'
import { Buttons } from './Buttons'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Nav />
      <Buttons />
      {children}
    </div>
  )
}

import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'


export const Route = createRootRoute({
  component: RootLayout,
})

function RootLayout() {
  return (
    <>
      <nav style={{ display: 'flex', gap: '1rem', padding: '1rem' }}>
        <Link to="/" className="">
          Home
        </Link>{' '}
        <Link to="/Routines" className="">
          Routines
        </Link>
        <Link to="/History" className="">
          Workout History
        </Link>
        <Link to="/Guide" className="">
          Guide
        </Link>
      </nav>
      <hr />
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>
      {/* Devtools to inspect routes */}
      <TanStackRouterDevtools />
    </>
  )
}
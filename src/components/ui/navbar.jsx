import { Icon } from '@iconify/react'
import { Button, Group } from '@mantine/core'
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function Navbar(_props) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log('Unauthenticated')
      console.log(status)
    },
  })

  return (
    <nav className="min-w-screen sticky top-0 z-30 shadow-lg ">
      <div className=" flex flex-row items-center justify-between bg-gray-50 px-5 py-3">
        <Link href="/" aria-label="Homepage" passHref>
          Home
        </Link>
        <div className="block">
          <div className=" flex h-full flex-row items-center justify-center font-medium ">
            {session && (
              <button
                className="mb-2 mr-2 rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 transition-all hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
                onClick={signOut}
              >
                Sign Out
              </button>
            )}
            {!session && (
              <Button
                leftIcon={<Icon icon="akar-icons:github-fill" />}
                className="bg-black transition-all hover:bg-slate-800"
                onClick={signIn}
              >
                Login with GitHub
              </Button>
            )}
          </div>
        </div>
      </div>
      <Group grow spacing={0}>
        <Button variant="default">First</Button>
        <Button variant="default">Second</Button>
        <Button variant="default">Third</Button>
      </Group>
    </nav>
  )
}

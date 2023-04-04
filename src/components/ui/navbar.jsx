import Link from 'next/link'

import { useState } from 'react'
import { useRouter } from 'next/router'

import { useSession, signIn, signOut } from 'next-auth/react'

import { Group, Button } from '@mantine/core'

import { Icon } from '@iconify/react'

export default function Navbar(props) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log('Unauthenticated')
      console.log(status)
    },
  })

  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsOpen(!isOpen)
  }

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
                className="mr-2 mb-2 rounded-lg border border-red-700 px-5 py-2.5 text-center text-sm font-medium text-red-700 transition-all hover:bg-red-800 hover:text-white focus:outline-none focus:ring-4 focus:ring-red-300 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-600 dark:hover:text-white dark:focus:ring-red-900"
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

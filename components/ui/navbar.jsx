import { GitHubLogoIcon } from "@radix-ui/react-icons"
import Link from 'next/link'
import { signIn, signOut, useSession } from 'next-auth/react'

import { Button } from "@/components/ui/button"

export default function Navbar(_props) {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log('Unauthenticated')
      console.log(status)
    },
  })

  const test = () => {
    console.log('test')
  }

  return (
    <nav className="min-w-screen sticky top-0 z-30 shadow-lg ">
      <div className="w-full flex flex-row items-center justify-between bg-red-50 px-5 py-3">
        <Link href="/" aria-label="Homepage" passHref className="text-3xl font-bold">
          Home
        </Link>

        <div className="block">
          <div className="flex h-full flex-row items-center justify-center font-medium ">
            {session && (
             
              <Button variant="outline" onClick={signOut}>Sign Out</Button>
            )}
            {!session && (
             
               <Button onClick={signIn}>
               <GitHubLogoIcon className="mr-2 h-4 w-4"  /> Login with GitHub
             </Button>
            )}
          </div>
        </div>
      </div>
      
      
    </nav>
  )
}

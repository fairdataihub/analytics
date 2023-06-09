import { signIn, signOut, useSession } from 'next-auth/react'

export default function Component() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      console.log('Unauthenticated')
    },
  })
  console.log(session, status)

  if (session) {
    return (
      <>
        Signed in as {session.user.email} <br />
        <button onClick={() => signOut()}>Sign out</button>
      </>
    )
  }
  return (
    <>
      Not signed in <br />
      <button onClick={() => signIn()}>Sign in</button>
    </>
  )
}

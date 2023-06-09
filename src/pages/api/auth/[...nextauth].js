import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'read:user user:email read:org user:org:read',
        },
      },
    }),
  ],
  callbacks: {
    async signIn({ _user, account, _metadata }) {
      const orgsResponse = await fetch('https://api.github.com/user/orgs', {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
        },
      })
      const orgs = await orgsResponse.json()
      const organization = orgs.find(
        (org) => org.login === process.env.GITHUB_ORG
      )

      if (!organization) {
        // return '/unauthorized';
        throw new Error('AccessDenied')
      }

      return true
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token
        token.account = account
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      session.authUser = user
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const func = (req, res) => NextAuth(req, res, options)

export default func

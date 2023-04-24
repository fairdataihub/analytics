import NextAuth from 'next-auth'
import GitHubProvider from 'next-auth/providers/github'

const options = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
      scope: 'read:user user:email read:org user:org:read',
      authorize: async (credentials) => {
        if (!credentials.organization) {
          return Promise.reject(
            new Error('The required organization scope was not granted')
          )
        }

        if (credentials.organization !== 'fairdataihub') {
          return Promise.reject(
            new Error('You are not a member of the fairdataihub organization')
          )
        }

        // Check if the user belongs to the fairdataihub organization
        const orgsResponse = await fetch('https://api.github.com/user/orgs', {
          headers: {
            Authorization: `Bearer ${credentials.access_token}`,
          },
        })
        const orgs = await orgsResponse.json()
        console.log('orgsResponse', orgs)
        const fairdataihubOrg = orgs.find((org) => org.login === 'fairdataihub')

        if (fairdataihubOrg) {
          return Promise.resolve(credentials)
        } else {
          return Promise.reject(
            new Error('You are not a member of the fairdataihub organization')
          )
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, metadata }) {
      console.log(process.env.GITHUB_ID)
      console.log(process.env.GITHUB_SECRET)
      const orgsResponse = await fetch('https://api.github.com/user/orgs', {
        headers: {
          Authorization: `Bearer ${account.access_token}`,
        },
      })
      console.log(account.access_token)
      const orgs = await orgsResponse.json()
      console.log('orgs', orgs)
      const fairdataihubOrg = orgs.find((org) => org.login === 'fairdataihub')

      if (!fairdataihubOrg) {
        throw new Error('You are not a member of the fairdataihub organization')
      }

      return true
    },
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        // console.log(account)
        token.accessToken = account.access_token
        token.account = account
      }
      return token
    },
    async session({ session, token, user }) {
      // console.log(session)
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      session.authUser = user
      return session
    },
  },
}

const func = (req, res) => NextAuth(req, res, options)

export default func

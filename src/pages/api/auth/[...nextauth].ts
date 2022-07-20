import NextAuth, { type NextAuthOptions } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import * as z from 'myzod'
import { db } from '~/server/prisma'
import { cryptoUtils } from '~/server/utils/crypto'

declare module 'next-auth' {
  interface User {
    id: number
  }

  interface Session {
    user: User
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { type: 'email' },
        password: { type: 'password' },
      },
      authorize: async (credentials) => {
        try {
          const creds = z
            .object({
              email: z
                .string()
                .max(255)
                .map((v) => v.toLowerCase()),
              password: z.string().max(255),
            })
            .parse({
              email: credentials?.email,
              password: credentials?.password,
            })

          const user = await db.user.findFirst({
            where: { email: creds.email },
          })

          if (!user) {
            throw new Error('Email or password is incorrect')
          }

          const isValidPassword = await cryptoUtils.verifyHashPass(
            creds.password,
            user.passwordHash
          )

          if (!isValidPassword) {
            throw new Error('Email or password is incorrect')
          }

          return {
            id: user.id,
          }
        } catch (e) {
          throw new Error('Invalid credentials')
        }
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
      }

      return token
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user = { id: token.id as any }
      }

      return session
    },
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    maxAge: 1 * 30 * 60, // 1 day
  },
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register',
  },
}

export default NextAuth(authOptions)

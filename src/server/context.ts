import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { unstable_getServerSession } from 'next-auth'
import { authOptions } from '~/pages/api/auth/[...nextauth]'

export async function createContext(opts: trpcNext.CreateNextContextOptions) {
  const req = opts?.req
  const res = opts?.res

  const session =
    req && res && (await unstable_getServerSession(req, res, authOptions))

  return {
    session,
    req,
    res,
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>

import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import {
  Session,
  unstable_getServerSession as getServerSession,
} from 'next-auth'
import { authOptions } from '~/pages/api/auth/[...nextauth]'

interface CreateContextOptions {
  session?: Session | null
}

/**
 * Inner function for `createContext` where we create the context.
 * This is useful for testing when we don't want to mock Next.js' request/response
 */
export async function createContextInner(_opts: CreateContextOptions) {
  return {
    session: _opts.session,
  }
}

export type Context = trpc.inferAsyncReturnType<typeof createContextInner>

/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions
): Promise<Context> {
  const req = opts?.req
  const res = opts?.res

  const session = req && res && (await getServerSession(req, res, authOptions))
  console.log(session)

  return await createContextInner({
    session,
  })
}

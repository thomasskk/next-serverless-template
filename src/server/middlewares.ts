import { TRPCError } from '@trpc/server'
import { procedure, t } from './trpc'

export const authedProcedure = procedure.use(
  t.middleware(({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }

    return next()
  })
)

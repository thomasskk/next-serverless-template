import { TRPCError } from '@trpc/server'
import { t } from './trpc'

export const authedProcedure = t.procedure.use(
  t.middleware(({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next()
  })
)

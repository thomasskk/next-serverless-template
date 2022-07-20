import { Context } from './context'
import { initTRPC } from '@trpc/server'
import superjson from 'superjson'

export const t = initTRPC<{
  ctx: Context
}>()({
  transformer: superjson,
  errorFormatter({ error, ctx, shape }) {
    if (process.env.NODE_ENV === 'development') {
      console.error(shape)
    }
    return {
      code: error.code,
      message:
        error.code === 'INTERNAL_SERVER_ERROR'
          ? 'An unexpected error occurred, please retry later'
          : error.message,
      data: {
        code: error.code,
        httpStatus: ctx?.req?.statusCode,
      },
    }
  },
})

export const procedure = t.procedure.use(
  t.middleware(async ({ next, type, path }) => {
    const start = Date.now()
    const res = await next()
    const duration = Date.now() - start

    res.ok
      ? console.info(`OK ${type.toUpperCase()} | ${path} | ${duration}ms`)
      : console.info(`ERROR ${type.toUpperCase()} | ${path} | ${duration}ms`)

    return res
  })
)

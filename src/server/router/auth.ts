import { t } from '../trpc'
import { authedProcedure } from '../middlewares'

export const authRouter = t.router({
  //////////////////////////////////////////
  me: authedProcedure.query(() => {}),
  //////////////////////////////////////////
})

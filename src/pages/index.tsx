import type { NextPage } from 'next'
import { t } from '~/utils/trpc'

const Home: NextPage = () => {
  t.auth.me.useQuery()

  return <div></div>
}

export default Home

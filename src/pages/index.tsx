import { ReactElement } from 'react'
import { DefaultLayout } from '~/layouts/DefaultLayout'
import { t } from '~/utils/trpc'

function Index() {
  t.auth.me.useQuery()

  return <div></div>
}

Index.getLayout = (page: ReactElement) => <DefaultLayout>{page}</DefaultLayout>

export default Index

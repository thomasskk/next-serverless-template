import { NextPage } from 'next'
import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'
import { ReactElement, ReactNode } from 'react'
import { DefaultLayout } from '~/layouts/DefaultLayout'
import { trpc } from '~/utils/trpc'
import '../styles/globals.css'
import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { Provider as JotaiProvider } from 'jotai'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp = ({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout) => {
  const getLayout =
    Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>)

  return (
    <SessionProvider session={session}>
      <JotaiProvider>
        <MantineProvider>
          <NotificationsProvider position='top-center' className='mt-24'>
            {getLayout(<Component {...pageProps} />)}
          </NotificationsProvider>
        </MantineProvider>
      </JotaiProvider>
    </SessionProvider>
  )
}

export default trpc.withTRPC(MyApp)

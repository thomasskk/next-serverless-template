import Head from 'next/head'
import { ReactNode } from 'react'
import { ReactQueryDevtools } from 'react-query/devtools'
import { Navbar } from '~/components/Navbar'

type DefaultLayoutProps = { children: ReactNode }

export function DefaultLayout({ children }: DefaultLayoutProps) {
  return (
    <>
      <Head>
        <title>social</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <Navbar />
      <main>{children}</main>

      {process.env.NODE_ENV !== 'production' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </>
  )
}

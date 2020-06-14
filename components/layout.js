import Head from 'next/head'
import Nav from './nav'

const siteTitle = 'EO Skoleregister'

export default function Layout({ children }) {
  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width' />
      </Head>

      <Nav />

      <main>
        <div className='container'>{children}</div>
      </main>
    </>
  )
}

import React from 'react'
import Link from 'next/link'
import styles from '../styles/nav.module.scss'
import { useRouter } from 'next/router'

export default function Nav({ user, loading }) {
  const router = useRouter()
  const path = router.pathname
  const { fylke } = router.query

  return (
    <div className={styles.header}>
      <h1>EO Skoleregister</h1>

      <div className={styles.buttongroup}>
        {path == '/[fylke]' && (
          <Link href='/'>
            <button>Velg fylke</button>
          </Link>
        )}

        {path == '/[fylke]/[id]' && (
          <>
            <Link href='/'>
              <button>Velg fylke</button>
            </Link>
            <Link href={`/${fylke}`}>
              <button>Skoleoversikt</button>
            </Link>
          </>
        )}

        {path == '/[fylke]/add' && (
          <>
            <Link href='/'>
              <button>Velg fylke</button>
            </Link>
            <Link href={`/${fylke}`}>
              <button>Skoleoversikt</button>
            </Link>
          </>
        )}

        <Link href='/api/logout'>
          <button>Logg ut</button>
        </Link>
      </div>
    </div>
  )
}

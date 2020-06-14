import React from 'react'
import Link from 'next/link'
import styles from '../styles/nav.module.scss'

export default function Nav({ user, loading }) {
  return (
    <div className={styles.header}>
      <h1>EO Skoleregister</h1>

      <div className={styles.buttongroup}>
        <Link href='/'>
          <button>Forsiden</button>
        </Link>
        <Link href='/api/logout'>
          <button>Logg ut</button>
        </Link>
      </div>
    </div>
  )
}

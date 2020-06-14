import React, { useState, useEffect } from 'react'
import { useRouter, withRouter } from 'next/router'

import { loadFirebase } from '../../lib/firebase'
import Layout from '../../components/layout'
import styles from '../../styles/skoleoversikt.module.scss'
import Link from 'next/link'

function Skoler({ router }) {
  const { fylke } = router.query
  const [fylkeNavn, setFylkeNavn] = useState('loading...')

  const firebase = loadFirebase()
  const db = firebase.firestore()

  useEffect(() => {
    if (fylke) {
      db.collection('Fylker')
        .doc(fylke)
        .get()
        .then((doc) => {
          setFylkeNavn(doc.data().Navn)
        })
    }
  }, [fylke])

  return (
    <Layout>
      <div className={styles.banner}>
        <h2 style={{ margin: 0 }}>{fylkeNavn}</h2>
      </div>

      <div className={styles.topNav}>
        <Link href={`/${fylke}/add`}>
          <button className={styles.addButton}>Legg til skole</button>
        </Link>
        <input
          type='text'
          name='search'
          placeholder='Søk'
          autoComplete='off'
          className={styles.search}
        />
      </div>
    </Layout>
  )
}

export default withRouter(Skoler)

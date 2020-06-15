import React, { useState, useEffect } from 'react'
import { useRouter, withRouter } from 'next/router'

import { loadFirebase } from '../../../lib/firebase'
import Layout from '../../../components/layout'
import styles from '../../../styles/skoleoversikt.module.scss'

function SkoleInfo({ router }) {
  const { fylke } = router.query
  const { id } = router.query
  const [skoleNavn, setSkoleNavn] = useState('loading...')

  const firebase = loadFirebase()
  const db = firebase.firestore()

  useEffect(() => {
    if (id) {
      console.log(id, fylke)
      db.collection('Fylker')
        .doc(fylke)
        .collection('Skoler')
        .doc(id)
        .get()
        .then((doc) => {
          setSkoleNavn(doc.data().Navn)
        })
    }
  }, [id])

  return (
    <Layout>
      <div className={styles.banner}>
        <h2 style={{ margin: 0 }}>{skoleNavn}</h2>
      </div>

      <div className={styles.topNav}>
        <h1>Skoleinfo</h1>
      </div>
    </Layout>
  )
}

export default withRouter(SkoleInfo)

import React, { useState, useEffect } from 'react'
import { loadFirebase } from '../lib/firebase'
import Layout from '../components/layout'
import Link from 'next/link'
import styles from '../styles/index.module.scss'

export default function Home() {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const [fylker, setFylker] = useState([])

  useEffect(() => {
    loadFylker()
  }, [])

  function loadFylker() {
    db.collection('Fylker')
      .get()
      .then((snapshot) => {
        const fylker = []

        snapshot.forEach((doc) => {
          fylker.push({ id: doc.id, navn: doc.data().Navn })
        })
        setFylker(fylker)
      })
  }

  return (
    <Layout>
      <div>
        <p>
          Dette er Elevorganisasjonens skoleregister. Her kan du sjekke og oppdatere informasjon om
          skolene i fylket ditt og føre logg over samtaler og kontakt.
        </p>
        <p>Start med å velge ditt fylket under:</p>
      </div>

      <div className={styles.fylkerDiv}>
        {fylker.map((fylke) => {
          return (
            <Link href={fylke.id} key={fylke.id}>
              <div className={styles.fylkeButton}>{fylke.navn}</div>
            </Link>
          )
        })}
      </div>
    </Layout>
  )
}

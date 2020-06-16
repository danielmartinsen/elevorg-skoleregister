import React, { useState, useEffect } from 'react'
import { useRouter, withRouter } from 'next/router'
import Collapsible from 'react-collapsible'

import { loadFirebase } from '../../../lib/firebase'
import Layout from '../../../components/layout'
import styles from '../../../styles/info.module.scss'

function SkoleInfo({ router }) {
  const { fylke } = router.query
  const { id } = router.query
  const [info, setInfo] = useState([])
  const [logg, setLogg] = useState([])
  const [loggAddMsg, setLoggAddMsg] = useState('')

  const firebase = loadFirebase()
  const db = firebase.firestore()
  const increment = firebase.firestore.FieldValue.increment(1)

  useEffect(() => {
    if (id) {
      db.collection('Fylker')
        .doc(fylke)
        .collection('Skoler')
        .doc(id)
        .get()
        .then((doc) => {
          setInfo(doc.data())
          loadLogg()
        })
    }
  }, [id])

  function loadLogg() {
    db.collection('Fylker')
      .doc(fylke)
      .collection('Skoler')
      .doc(id)
      .get()
      .then((doc) => {
        const loggElements = []
        for (var loggEntry in doc.data().Logg) {
          if (loggEntry != 'count') {
            loggElements.push(
              <div className={styles.loggMessage}>
                <span>
                  {doc.data().Logg[loggEntry].Navn} ({doc.data().Logg[loggEntry].Tidspunkt})
                </span>
                <p>{doc.data().Logg[loggEntry].Kommentar}</p>
              </div>
            )
          }
        }
        setLogg(loggElements)
      })
  }

  function loggAdd() {
    db.collection('Fylker')
      .doc(fylke)
      .collection('Skoler')
      .doc(id)
      .get()
      .then((doc) => {
        const loggIncrement = doc.data().Logg.count + 1
        const loggCount = doc.data().Logg.count + 100

        const dato = new Date()
        const idag = dato.getDate() + '.' + (dato.getMonth() + 1) + '.' + dato.getFullYear()

        const batch = db.batch()
        const loggRef = db.collection('Fylker').doc(fylke).collection('Skoler').doc(id)

        batch.set(
          loggRef,
          {
            Logg: {
              count: loggIncrement,
              [loggCount]: { Navn: 'Test', Tidspunkt: idag, Kommentar: loggAddMsg },
            },
          },
          { merge: true }
        )

        batch.commit().then(() => {
          console.log(loggAddMsg)
          loadLogg()
          document.getElementById('loggAddTextarea').value = ''
        })
      })
  }

  return (
    <Layout>
      <div className={styles.banner}>
        <h2 style={{ margin: 0 }}>{info.Navn}</h2>
      </div>

      <div className={styles.column}>
        <div className={styles.infoDiv} style={{ marginRight: 10 }}>
          <h2>Skoleinformasjon</h2>
          <p>Adresse: {info.Adresse}</p>
          <p>Telefon: {info.Telefon}</p>
          <p>Epost: {info.Epost}</p>
          <p>Antall elever: {info.Elever}</p>
          <p>Ansvarsperson: {info.Ansvarsperson}</p>
        </div>

        {info.Leder && (
          <Collapsible trigger='Elevrådsleder'>
            <p>Navn: {info.Leder.Navn}</p>
            <p>Telefon: {info.Leder.Telefon}</p>
            <p>Epost: {info.Leder.Epost}</p>
          </Collapsible>
        )}

        {info.Nestleder && (
          <Collapsible trigger='Nestleder'>
            <p>Navn: {info.Nestleder.Navn}</p>
            <p>Telefon: {info.Nestleder.Telefon}</p>
            <p>Epost: {info.Nestleder.Epost}</p>
          </Collapsible>
        )}

        {info.Kontakt && (
          <Collapsible trigger='Elevrådskontakt'>
            <p>Navn: {info.Kontakt.Navn}</p>
            <p>Telefon: {info.Kontakt.Telefon}</p>
            <p>E-post: {info.Kontakt.Epost}</p>
          </Collapsible>
        )}
      </div>

      <div className={styles.column}>
        <div className={styles.infoDiv} style={{ marginLeft: 10 }}>
          <h2>Kontaktlogg</h2>
          <div className={styles.loggDiv}>{logg}</div>

          <textarea
            className={styles.loggAddMessage}
            placeholder='Din loggføring...'
            id='loggAddTextarea'
            onChange={(e) => setLoggAddMsg(e.target.value)}></textarea>
          <button className={styles.loggAddButton} onClick={() => loggAdd()}>
            Send
          </button>
        </div>
      </div>

      <style jsx>
        {`
          .Collapsible {
            width: 100%;
            color: #ffb19f;
          }
        `}
      </style>
    </Layout>
  )
}

export default withRouter(SkoleInfo)

import React, { useState, useEffect } from 'react'
import { useRouter, withRouter } from 'next/router'
import { DeleteOutlined, EditOutlined, InfoOutlined } from '@material-ui/icons'

import { loadFirebase } from '../../lib/firebase'
import Layout from '../../components/layout'
import styles from '../../styles/skoleoversikt.module.scss'
import Link from 'next/link'

function Skoler({ router }) {
  const { fylke } = router.query
  const [fylkeNavn, setFylkeNavn] = useState('loading...')
  const [skoler, setSkoler] = useState([])
  const [filter, setFilter] = useState('')

  const firebase = loadFirebase()
  const db = firebase.firestore()

  function search(e) {
    setFilter(e.target.value.toUpperCase())
  }

  useEffect(() => {
    if (fylke) {
      db.collection('Fylker')
        .doc(fylke)
        .get()
        .then((doc) => {
          setFylkeNavn(doc.data().Navn)
        })
      loadSkoler()
    }
  }, [fylke])

  function loadSkoler() {
    db.collection('Fylker')
      .doc(fylke)
      .collection('Skoler')
      .get()
      .then((snapshot) => {
        const skoler = []

        snapshot.forEach((doc) => {
          skoler.push({ id: doc.id, navn: doc.data().Navn, ansvar: doc.data().Ansvarsperson })
        })
        setSkoler(skoler.sort((a, b) => (a.navn > b.navn ? 1 : -1)))
      })
  }

  function deleteSkole(id) {
    if (confirm('Sikker på at du vil slette skolen fra registeret?')) {
      db.collection('Fylker')
        .doc(fylke)
        .collection('Skoler')
        .doc(id)
        .delete()
        .then(() => {
          loadSkoler()
        })
    }
  }

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
          onKeyUp={(e) => search(e)}
          className={styles.search}
        />
      </div>

      {skoler.map((skole) => {
        var navn = skole.navn.toUpperCase()
        if (navn.includes(filter)) {
          return (
            <div className={styles.skoleDiv} key={skole.id}>
              <div>
                <h1>{skole.navn}</h1>
                <p>Ansvarsperson: {skole.ansvar}</p>
              </div>

              <div style={{ float: 'right', display: 'flex', alignItems: 'center' }}>
                <Link href={`/${fylke}/${skole.id}`}>
                  <InfoOutlined className={styles.icons} />
                </Link>
                <EditOutlined className={styles.icons} />
                <DeleteOutlined className={styles.icons} onClick={() => deleteSkole(skole.id)} />
              </div>
            </div>
          )
        }
      })}
    </Layout>
  )
}

export default withRouter(Skoler)

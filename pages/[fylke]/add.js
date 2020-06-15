import React, { useState, useEffect } from 'react'
import { useRouter, withRouter } from 'next/router'
import Link from 'next/link'
import { useForm } from 'react-hook-form'

import { loadFirebase } from '../../lib/firebase'
import Layout from '../../components/layout'
import styles from '../../styles/addskole.module.scss'

function Add({ router }) {
  const { register, handleSubmit } = useForm()
  const [formCompleted, handleComplete] = useState(false)
  const { fylke } = router.query

  const firebase = loadFirebase()
  const db = firebase.firestore()
  const increment = firebase.firestore.FieldValue.increment(1)

  const onSubmit = (data) => {
    var skoleData = {
      Navn: data.Navn,
      Adresse: data.Adresse,
      Telefon: data.Telefon,
      Ansvarsperson: data.Ansvarsperson,
      Elever: data.Elever,
      Epost: data.Epost,
      Kommentar: '',
      Kontakt: {
        Navn: data.ekNavn,
        Epost: data.ekEpost,
        Telefon: data.ekTelefon,
      },
      Leder: {
        Navn: data.elNavn,
        Epost: data.elEpost,
        Telefon: data.elTelefon,
      },
      Nestleder: {
        Navn: data.nlNavn,
        Epost: data.nlEpost,
        Telefon: data.nlTelefon,
      },
      Logg: {
        count: 0,
      },
    }

    db.collection('Fylker')
      .doc(fylke)
      .get()
      .then((doc) => {
        const count = (doc.data().countSkoler + 1000).toString()
        const batch = db.batch()
        const skoleRef = db.collection('Fylker').doc(fylke).collection('Skoler').doc(count)
        const statsRef = db.collection('Fylker').doc(fylke)

        batch.set(skoleRef, skoleData)
        batch.set(statsRef, { countSkoler: increment }, { merge: true })

        batch.commit().then(() => {
          handleComplete(true)
          document.getElementById('skoleForm').reset()
        })
      })
  }

  return (
    <Layout>
      <div className={styles.banner}>
        <h2 style={{ margin: 0 }}>Legg til en skole</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} id='skoleForm' className={styles.addForm}>
        <div>
          <h3>Skoleinformasjon:</h3>
          <input type='text' name='Navn' placeholder='Navn' ref={register} />
          <input type='text' name='Epost' placeholder='E-post' ref={register} />
          <input type='text' name='Telefon' placeholder='Telefon' ref={register} />
          <input type='text' name='Adresse' placeholder='Adresse' ref={register} />
          <input type='number' name='Elever' placeholder='Antall elever' ref={register} />
          <input type='text' name='Ansvarsperson' placeholder='Ansvarsperson' ref={register} />
        </div>

        <div>
          <h3>Elevrådsleder:</h3>
          <input type='text' name='elNavn' placeholder='Navn' ref={register} />
          <input type='text' name='elEpost' placeholder='E-post' ref={register} />
          <input type='text' name='elTelefon' placeholder='Telefon' ref={register} />
        </div>

        <div>
          <h3>Nestleder:</h3>
          <input type='text' name='nlNavn' placeholder='Navn' ref={register} />
          <input type='text' name='nlEpost' placeholder='E-post' ref={register} />
          <input type='text' name='nlTelefon' placeholder='Telefon' ref={register} />
        </div>

        <div>
          <h3>Elevrådskontakt:</h3>
          <input type='text' name='ekNavn' placeholder='Navn' ref={register} />
          <input type='text' name='ekEpost' placeholder='E-post' ref={register} />
          <input type='text' name='ekTelefon' placeholder='Telefon' ref={register} />
        </div>

        <input type='submit' value='LEGG TIL' />
        <Link href={`/${fylke}`}>
          <input type='button' value='TILBAKE' />
        </Link>
      </form>

      {formCompleted ? (
        <div className={styles.formFeedback}>
          <p>Skolen er registrert!</p>
        </div>
      ) : (
        ''
      )}
    </Layout>
  )
}

export default withRouter(Add)

import { parseCookies } from '@/helpers/index'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { FaPencilAlt, FaTimes } from 'react-icons/fa'
import Link from 'next/link'
import Image from 'next/image'
import Layout from '@/components/Layout'
import EventMap from '@/components/EventMap'
import { API_URL } from '@/config/index'
import { useState, useEffect, useContext } from 'react'
import AuthContext from '@/context/AuthContext'
import styles from '@/styles/Event.module.css'
import { useRouter } from 'next/router'

export default function EventPage({ evt,token }) {
  const [isOwned, setOwned] = useState(false)
  const router = useRouter()
  const { user } = useContext(AuthContext)
  useEffect(() => { getOwner() }, [user,token])

  const getOwner = async () => {
    const res = await fetch(`${API_URL}/api/users?filters[events][id][$eq]=${evt.id}`,{
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const usr = await res.json()
    if (user) setOwned(user.id === usr[0].id)
    else setOwned(false)
  }

  const deleteEvent = async (e) => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message)
      } else {
        router.push('/account/dashboard')
      }
    }
  }

  return (
    <Layout>
      <div className={styles.event}>
        {isOwned && <div className={styles.controls}>
          <Link href={`/events/edit/${evt.id}`}>
            <a>
              <FaPencilAlt /> Edit Event
            </a>
          </Link>
          <a href='#' className={styles.delete} onClick={deleteEvent}>
            <FaTimes /> Delete Event
          </a>
        </div>}

        <span>
          {new Date(evt.attributes.date).toLocaleDateString('en-US')} at {evt.attributes.time}
        </span>
        <h1>{evt.attributes.name}</h1>
        <ToastContainer />
        {evt.attributes.image.data && (
          <div className={styles.image}>
            <Image src={evt.attributes.image.data.attributes.formats.medium.url} width={960} height={600} />
          </div>
        )}

        <h3>Performers:</h3>
        <p>{evt.attributes.performers}</p>
        <h3>Description:</h3>
        <p>{evt.attributes.description}</p>
        <h3>Venue: {evt.attributes.venue}</h3>
        <p>{evt.attributes.address}</p>
        
        <EventMap evt={evt} />

        <Link href='/events'>
          <a className={styles.back}>{'<'} Go Back</a>
        </Link>
      </div>
    </Layout>
  )
}


export async function getServerSideProps({ params: { slug },req }) {
  const { token } = parseCookies(req)
  const res = await fetch(`${API_URL}/api/events?filters[slug][$eq]=${slug}&populate=*`)
  const events = await res.json()

  return {
    props: {
      evt: events.data[0],
      token: token || '',
    },
  }
}


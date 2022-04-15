import Image from 'next/image'
import { useState, useEffect } from 'react'
import ReactMapGl, { Marker } from 'react-map-gl'
import 'mapbox-gl/dist/mapbox-gl.css'
import Geocode from 'react-geocode'

export default function EventMap({ evt }) {
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [loading, setLoading] = useState(true)
  const [viewport, setViewport] = useState({
    latitude: 33.6844,
    longitude: 73.0479,
    zoom: 12,
  })

  useEffect(() => {
    // Get latitude & longitude from address.
    Geocode.fromAddress(evt.attributes.address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location
        setLat(lat)
        setLng(lng)
        setViewport({ ...viewport, latitude: lat, longitude: lng })
        setLoading(false)
      },
      (error) => {
        console.error(error)
      }
    )
  }, [])

  Geocode.setApiKey(process.env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY)

  if (loading) return false

  return (
    <ReactMapGl
    initialViewState={viewport}
    style={{width: '100%', height: 500}}
    mapStyle="mapbox://styles/mapbox/streets-v9"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_TOKEN}
    >
      <Marker key={evt.id} latitude={lat} longitude={lng}>
        <Image src='/images/pin.svg' width={30} height={30} />
      </Marker>
    </ReactMapGl>
  )
}

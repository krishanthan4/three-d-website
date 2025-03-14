'use client'

import { Text } from '@react-three/drei'

export default function HistoricalMarkers() {
  const markers = [
    // Original markers
    { text: "RENAISSANCE ITALY, 1476", position: [-8, 6, -5] as [number, number, number] },
    { text: "OTTOMAN ISTANBUL, 1511", position: [8, 4, -10] as [number, number, number] },
    { text: "COLONIAL AMERICA, 1754", position: [3, 8, -4] as [number, number, number] },
    { text: "REVOLUTIONARY PARIS, 1789", position: [-10, 10, -15] as [number, number, number] },
    { text: "ANCIENT EGYPT, 49 BCE", position: [-15, 5, -12] as [number, number, number] },
    { text: "VIKING AGE, 873 CE", position: [10, 3, -5] as [number, number, number] },
    
    // Additional markers
    { text: "INDUSTRIAL LONDON, 1868", position: [-6, 2, -3] as [number, number, number] },
    { text: "PTOLEMAIC EGYPT, 48 BCE", position: [6, 7, -8] as [number, number, number] },
    { text: "CARIBBEAN SEAS, 1715", position: [-4, 9, -6] as [number, number, number] },
    { text: "ANCIENT GREECE, 431 BCE", position: [12, 5, -10] as [number, number, number] },
    { text: "CRUSADER HOLY LAND, 1191", position: [-12, 4, -7] as [number, number, number] },
    { text: "MING DYNASTY CHINA, 1526", position: [5, 1, -3] as [number, number, number] }
  ]
  
  return (
    <>
      {markers.map((marker, idx) => (
        <Text 
          key={idx}
          position={marker.position}
          color="#ffffff"
          fontSize={0.7}
          anchorX="center"
          anchorY="middle"
          fillOpacity={0.9}
          outlineWidth={0.04}
          outlineColor="#ff0000"
          userData={{ class: "ac-marker-text" }}
        >
          {marker.text}
        </Text>
      ))}
    </>
  )
}

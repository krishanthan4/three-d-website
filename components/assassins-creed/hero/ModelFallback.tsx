'use client'

import { Text } from '@react-three/drei'

export default function ModelFallback() {
  return (
    <Text color="#ffffff" fontSize={1} position={[0, 0, 0]}>
      Loading...
    </Text>
  )
}

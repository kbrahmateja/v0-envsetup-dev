"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Box, Sphere } from "@react-three/drei"
import type * as THREE from "three"

interface Computer3DProps {
  position?: [number, number, number]
}

export default function Computer3D({ position = [0, 0, 0] }: Computer3DProps) {
  const groupRef = useRef<THREE.Group>(null)
  const packageRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (packageRef.current) {
      packageRef.current.rotation.y = state.clock.getElapsedTime() * 0.5
      packageRef.current.position.y = Math.sin(state.clock.getElapsedTime() * 2) * 0.1
    }
  })

  return (
    <group ref={groupRef} position={position}>
      {/* Laptop Base */}
      <Box args={[2, 0.1, 1.5]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a1a" metalness={0.8} roughness={0.2} />
      </Box>

      {/* Laptop Screen */}
      <Box args={[2, 1.3, 0.05]} position={[0, 0.7, -0.7]} rotation={[-0.2, 0, 0]}>
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.1} />
      </Box>

      {/* Screen Display */}
      <Box args={[1.8, 1.1, 0.01]} position={[0, 0.7, -0.67]} rotation={[-0.2, 0, 0]}>
        <meshStandardMaterial color="#1e40af" emissive="#3b82f6" emissiveIntensity={0.5} toneMapped={false} />
      </Box>

      {/* Package Box */}
      <Box ref={packageRef} args={[0.8, 0.8, 0.8]} position={[-0.3, 1, 0.5]}>
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#a78bfa"
          emissiveIntensity={0.3}
          metalness={0.5}
          roughness={0.5}
        />
      </Box>

      {/* Package Glow */}
      <Sphere args={[0.5, 32, 32]} position={[-0.3, 1, 0.5]}>
        <meshBasicMaterial color="#a78bfa" transparent opacity={0.2} />
      </Sphere>
    </group>
  )
}

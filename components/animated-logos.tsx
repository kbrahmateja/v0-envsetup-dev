"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { Text, Billboard } from "@react-three/drei"
import type * as THREE from "three"

export default function AnimatedLogos() {
  const groupRef = useRef<THREE.Group>(null)

  // Programming languages and tools
  const logos = useMemo(
    () => [
      { name: "React", color: "#61DAFB", position: [-8, 3, -5] },
      { name: "Node.js", color: "#339933", position: [8, 2, -3] },
      { name: "Python", color: "#3776AB", position: [-6, -2, -4] },
      { name: "Docker", color: "#2496ED", position: [7, -3, -2] },
      { name: "K8s", color: "#326CE5", position: [-7, 1, -6] },
      { name: "AWS", color: "#FF9900", position: [6, 4, -4] },
      { name: "TypeScript", color: "#3178C6", position: [-5, 4, -3] },
      { name: "Next.js", color: "#000000", position: [5, -1, -5] },
      { name: "MongoDB", color: "#47A248", position: [-8, -1, -2] },
      { name: "PostgreSQL", color: "#4169E1", position: [8, 1, -6] },
      { name: "Redis", color: "#DC382D", position: [-6, 3, -2] },
      { name: "Nginx", color: "#009639", position: [7, 2, -5] },
      { name: "Go", color: "#00ADD8", position: [-7, -3, -3] },
      { name: "Rust", color: "#000000", position: [6, -2, -6] },
      { name: "Vue", color: "#4FC08D", position: [-5, 2, -4] },
    ],
    [],
  )

  // Animate logos moving towards the package
  useFrame((state) => {
    if (groupRef.current) {
      logos.forEach((_, index) => {
        const mesh = groupRef.current?.children[index]
        if (mesh) {
          // Spiral motion towards center
          const time = state.clock.getElapsedTime()
          const speed = 0.3 + index * 0.05
          const radius = 5 + Math.sin(time * speed) * 2
          const angle = time * speed + index * ((Math.PI * 2) / logos.length)

          mesh.position.x = Math.cos(angle) * radius
          mesh.position.y = Math.sin(angle * 0.7) * 3
          mesh.position.z = Math.sin(angle) * radius - 3

          // Rotate for effect
          mesh.rotation.y = time + index
        }
      })
    }
  })

  return (
    <group ref={groupRef}>
      {logos.map((logo, index) => (
        <Billboard key={index} position={logo.position as [number, number, number]}>
          <Text
            fontSize={0.5}
            color={logo.color}
            anchorX="center"
            anchorY="middle"
            outlineWidth={0.02}
            outlineColor="#000000"
          >
            {logo.name}
          </Text>
        </Billboard>
      ))}
    </group>
  )
}

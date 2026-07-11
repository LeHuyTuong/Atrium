'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { OrbitControls, Environment, ContactShadows, Grid } from '@react-three/drei'
import { Suspense, useEffect, useRef } from 'react'
import * as THREE from 'three'
import Dynamo3D, { DynamoPartsVisibility, DynamoLabels } from './Dynamo3D'

interface DynamoSceneProps {
  rotationSpeed: number
  isGenerating: boolean
  visible: DynamoPartsVisibility
  labels: DynamoLabels
  explode: number
}

const VIEWS: Record<string, [number, number, number]> = {
  front: [0, 1.5, 11],
  side: [11, 1.5, 0],
  top: [0.5, 11, 0.5],
}

function CameraController() {
  const { camera } = useThree()

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      const target = VIEWS[detail.view]
      if (target) {
        const start = camera.position.clone()
        const end = new THREE.Vector3(...target)
        const duration = 800
        const startTime = performance.now()
        const animate = () => {
          const elapsed = performance.now() - startTime
          const t = Math.min(elapsed / duration, 1)
          const e = 1 - Math.pow(1 - t, 3)
          camera.position.lerpVectors(start, end, e)
          camera.lookAt(0, 0, 0)
          if (t < 1) requestAnimationFrame(animate)
        }
        animate()
      }
    }
    window.addEventListener('dynamo-camera', handler)
    return () => window.removeEventListener('dynamo-camera', handler)
  }, [camera])

  return null
}

export default function DynamoScene(props: DynamoSceneProps) {
  return (
    <Canvas
      shadows
      camera={{ position: [6, 3.5, 7], fov: 42 }}
      gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
      dpr={[1, 2]}
      style={{ width: '100%', height: '100%', display: 'block' }}
    >
      <color attach="background" args={['#0a0e17']} />
      <fog attach="fog" args={['#0a0e17', 18, 40]} />

      <Suspense fallback={null}>
        {/* Lighting setup - studio style */}
        <ambientLight intensity={0.45} />
        {/* Key light */}
        <directionalLight
          position={[6, 9, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
          shadow-camera-near={0.1}
          shadow-camera-far={40}
          shadow-bias={-0.0005}
        />
        {/* Fill light */}
        <directionalLight position={[-6, 5, -3]} intensity={0.55} color="#a3c4e0" />
        {/* Rim light */}
        <directionalLight position={[0, 3, -9]} intensity={0.9} color="#fbbf24" />
        {/* Subtle bottom fill */}
        <pointLight position={[0, -5, 0]} intensity={0.35} color="#ffffff" distance={14} />

        <group position={[0, 1.5, 0]}>
          {/* The dynamo model - centered */}
          <Dynamo3D {...props} />

          {/* Floor grid */}
          <Grid
            position={[0, -2.6, 0]}
            args={[40, 40]}
            cellSize={0.5}
            cellThickness={0.6}
            cellColor="#1e2a3f"
            sectionSize={2.5}
            sectionThickness={1.0}
            sectionColor="#fbbf24"
            fadeDistance={28}
            fadeStrength={1.5}
            followCamera={false}
            infiniteGrid
          />

          {/* Contact shadow under model */}
          <ContactShadows
            position={[0, -2.4, 0]}
            opacity={0.7}
            scale={16}
            blur={2.5}
            far={6}
            color="#000000"
          />
        </group>

        <Environment preset="warehouse" background={false} />

        <CameraController />

        <OrbitControls
          enablePan
          enableZoom
          enableRotate
          minDistance={4}
          maxDistance={22}
          target={[0, 0, 0]}
          enableDamping
          dampingFactor={0.08}
        />
      </Suspense>
    </Canvas>
  )
}

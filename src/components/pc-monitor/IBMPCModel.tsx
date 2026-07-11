'use client'

import { useRef, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import * as THREE from 'three'

/* ------------------------------------------------------------------ */
/*  Material palette – the iconic IBM "Putty Beige" (Pantone 4605C)   */
/* ------------------------------------------------------------------ */
const IBM_BEIGE = '#c8c2b4'
const IBM_BEIGE_DARK = '#a8a294'
const IBM_BEIGE_LIGHT = '#d8d2c4'
const IBM_LABEL_GREY = '#6b665c'
const SCREEN_GREEN = '#33ff66'
const SCREEN_DARK = '#0a1a0a'
const KEY_BLACK = '#1a1a1a'
const KEY_DARK_GREY = '#2b2b2b'
const LED_RED = '#ff3322'
const LED_GREEN = '#33ff66'
const BADGE_SILVER = '#9a9a9a'
const CABLE_BLACK = '#1a1a1a'
const PAPER_WHITE = '#f5f1e0'
const COFFEE_BROWN = '#3d2817'
const MUG_WHITE = '#e8e4dc'

/* ------------------------------------------------------------------ */
/*  GEOMETRY CONSTANTS                                                  */
/* ------------------------------------------------------------------ */
const DESK_Y = -0.75
const SU_HALF_H = 0.75
const SU_TOP_Y = DESK_Y + SU_HALF_H * 2 // 0.75
const MON_HALF_H = 1.7
const MON_CENTER_Y = SU_TOP_Y + MON_HALF_H // 2.45

/* ------------------------------------------------------------------ */
/*  Helper: build a curved cable as TubeGeometry                        */
/* ------------------------------------------------------------------ */
function makeCable(points: [number, number, number][], radius = 0.05): THREE.TubeGeometry {
  const curve = new THREE.CatmullRomCurve3(
    points.map((p) => new THREE.Vector3(...p))
  )
  return new THREE.TubeGeometry(curve, 64, radius, 8, false)
}

/* ------------------------------------------------------------------ */
/*  System Unit (the horizontal beige box with two 5.25" floppy drives) */
/* ------------------------------------------------------------------ */
function SystemUnit() {
  const vents = useMemo(() => {
    const arr: number[] = []
    for (let i = 0; i < 24; i++) arr.push(-2.4 + i * 0.21)
    return arr
  }, [])

  // Power cable geometry – exits rear-left of SU, curves down to desk, runs off
  const powerCable = useMemo(
    () =>
      makeCable(
        [
          [-2.4, 0.3, -2.2],
          [-2.9, 0.1, -2.6],
          [-3.4, -0.4, -3.0],
          [-4.2, DESK_Y + 0.03, -3.6],
          [-5.4, DESK_Y + 0.03, -4.2],
        ],
        0.06
      ),
    []
  )

  return (
    <group position={[0, 0, 0]}>
      {/* Main chassis body */}
      <RoundedBox args={[5.6, 1.5, 4.4]} radius={0.08} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={IBM_BEIGE} roughness={0.65} metalness={0.05} />
      </RoundedBox>

      {/* Top ventilation grille */}
      <group position={[0, 0.76, -1.6]}>
        {vents.map((x, i) => (
          <mesh key={i} position={[x, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[0.08, 1.1]} />
            <meshStandardMaterial color={IBM_BEIGE_DARK} roughness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Front bezel */}
      <mesh position={[0, 0, 2.21]}>
        <planeGeometry args={[5.4, 1.35]} />
        <meshStandardMaterial color={IBM_BEIGE_LIGHT} roughness={0.7} />
      </mesh>

      {/* Floppy drives */}
      <FloppyDrive position={[-1.25, 0.05, 2.22]} />
      <FloppyDrive position={[1.25, 0.05, 2.22]} />

      {/* Power LED + badge between drives */}
      <group position={[0, -0.05, 2.23]}>
        <mesh position={[0, 0.25, 0]}>
          <circleGeometry args={[0.04, 16]} />
          <meshStandardMaterial color={LED_GREEN} emissive={LED_GREEN} emissiveIntensity={0.7} />
        </mesh>
        <Text position={[0, 0.25, 0.005]} fontSize={0.03} color={IBM_LABEL_GREY} anchorX="center" anchorY="middle">
          PWR
        </Text>
        <mesh position={[0, -0.18, 0]}>
          <planeGeometry args={[1.4, 0.22]} />
          <meshStandardMaterial color={BADGE_SILVER} metalness={0.7} roughness={0.35} />
        </mesh>
      </group>

      {/* IBM logo */}
      <Text
        position={[2.0, -0.55, 2.235]}
        fontSize={0.18}
        letterSpacing={0.05}
        color={IBM_LABEL_GREY}
        anchorX="center"
        anchorY="middle"
      >
        IBM
      </Text>
      <Text
        position={[2.0, -0.74, 2.235]}
        fontSize={0.075}
        letterSpacing={0.02}
        color={IBM_LABEL_GREY}
        anchorX="center"
        anchorY="middle"
      >
        Personal Computer
      </Text>

      {/* Model number badge bottom-left */}
      <Text
        position={[-2.0, -0.62, 2.235]}
        fontSize={0.06}
        color={IBM_LABEL_GREY}
        anchorX="center"
      >
        TYPE 5150
      </Text>

      {/* Side ridges */}
      {[-2.81, 2.81].map((x, i) => (
        <mesh key={i} position={[x, 0, 0]}>
          <boxGeometry args={[0.04, 1.3, 4.2]} />
          <meshStandardMaterial color={IBM_BEIGE_DARK} roughness={0.8} />
        </mesh>
      ))}

      {/* Rear connector panel */}
      <mesh position={[0, 0.1, -2.21]}>
        <planeGeometry args={[5.2, 1.2]} />
        <meshStandardMaterial color={IBM_BEIGE_DARK} roughness={0.85} />
      </mesh>
      {/* Rear connectors (D-sub ports) */}
      {[-2.0, -1.4, -0.8, 0.5, 1.5, 2.1].map((x, i) => (
        <mesh key={i} position={[x, 0.1, -2.215]}>
          <boxGeometry args={[0.5, 0.4, 0.05]} />
          <meshStandardMaterial color={KEY_DARK_GREY} metalness={0.5} roughness={0.5} />
        </mesh>
      ))}
      {/* Power inlet socket (label) */}
      <Text position={[-2.0, 0.55, -2.215]} fontSize={0.05} color={IBM_LABEL_GREY} anchorX="center">
        POWER
      </Text>

      {/* Power cable */}
      <mesh geometry={powerCable} castShadow>
        <meshStandardMaterial color={CABLE_BLACK} roughness={0.7} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Floppy drive (5.25" half-height)                                   */
/* ------------------------------------------------------------------ */
function FloppyDrive({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <RoundedBox args={[1.9, 0.7, 0.1]} radius={0.03} smoothness={3} position={[0, 0, 0.06]}>
        <meshStandardMaterial color={IBM_BEIGE_DARK} roughness={0.7} />
      </RoundedBox>

      {/* Disk slot */}
      <mesh position={[0, 0.05, 0.12]}>
        <boxGeometry args={[1.3, 0.06, 0.04]} />
        <meshStandardMaterial color={KEY_BLACK} roughness={0.9} />
      </mesh>

      {/* Eject lever */}
      <mesh position={[0.78, 0.05, 0.14]}>
        <boxGeometry args={[0.08, 0.22, 0.06]} />
        <meshStandardMaterial color={IBM_BEIGE} roughness={0.6} />
      </mesh>

      {/* Activity LED (green) */}
      <mesh position={[-0.78, -0.22, 0.13]}>
        <circleGeometry args={[0.035, 12]} />
        <meshStandardMaterial color={LED_GREEN} emissive={LED_GREEN} emissiveIntensity={0.5} />
      </mesh>

      {/* Drive label */}
      <mesh position={[-0.78, -0.05, 0.13]}>
        <planeGeometry args={[0.45, 0.18]} />
        <meshStandardMaterial color={IBM_LABEL_GREY} roughness={0.9} />
      </mesh>
      <Text position={[-0.78, -0.05, 0.135]} fontSize={0.05} color={PAPER_WHITE} anchorX="center" anchorY="middle">
        5.25" FDD
      </Text>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  CRT Monitor – IBM 5151 style monochrome green display             */
/* ------------------------------------------------------------------ */
function CRTMonitor({ position, powered = true, screenText = 'C:\\>dir\nVolume in drive C is MS-DOS\nDirectory of C:\\\n\nCOMMAND  COM   25307  08-12-81\nAUTOEXEC BAT      42  08-12-81\nCONFIG   SYS     128  08-12-81\n        3 file(s)  25477 bytes\n                      204800 bytes free\n\nC:\\>_' }: { position: [number, number, number]; powered?: boolean; screenText?: string }) {
  const screenRef = useRef<THREE.MeshStandardMaterial>(null)
  const glowRef = useRef<THREE.PointLight>(null)

  useFrame(({ clock }) => {
    if (powered && screenRef.current) {
      const t = clock.getElapsedTime()
      screenRef.current.emissiveIntensity = 0.55 + Math.sin(t * 12) * 0.05 + Math.sin(t * 47) * 0.02
    } else if (screenRef.current) {
      screenRef.current.emissiveIntensity = 0
    }
    if (glowRef.current) {
      glowRef.current.intensity = powered ? 0.8 + Math.sin(clock.getElapsedTime() * 12) * 0.1 : 0
    }
  })

  // Scanline texture – generated procedurally on a canvas
  const scanlineTexture = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = 4
    c.height = 8
    const ctx = c.getContext('2d')!
    ctx.fillStyle = 'rgba(0,0,0,0)'
    ctx.fillRect(0, 0, 4, 8)
    ctx.fillStyle = 'rgba(0,0,0,0.35)'
    ctx.fillRect(0, 0, 4, 2)
    const tex = new THREE.CanvasTexture(c)
    tex.wrapS = THREE.RepeatWrapping
    tex.wrapT = THREE.RepeatWrapping
    tex.repeat.set(60, 30)
    return tex
  }, [])

  return (
    <group position={position}>
      {/* Monitor outer case */}
      <RoundedBox args={[4.0, 3.4, 3.6]} radius={0.18} smoothness={4} castShadow receiveShadow>
        <meshStandardMaterial color={IBM_BEIGE} roughness={0.7} metalness={0.05} />
      </RoundedBox>

      {/* IBM badge on monitor top bezel */}
      <Text
        position={[0, 1.45, 1.82]}
        fontSize={0.13}
        letterSpacing={0.08}
        color={IBM_LABEL_GREY}
        anchorX="center"
        anchorY="middle"
      >
        IBM
      </Text>
      <Text
        position={[0, 1.28, 1.82]}
        fontSize={0.055}
        color={IBM_LABEL_GREY}
        anchorX="center"
        anchorY="middle"
      >
        MONOCHROME DISPLAY 5151
      </Text>

      {/* Front bezel (recessed) */}
      <mesh position={[0, 0, 1.81]}>
        <planeGeometry args={[3.7, 3.1]} />
        <meshStandardMaterial color={IBM_BEIGE_DARK} roughness={0.8} />
      </mesh>

      {/* CRT screen – curved cap */}
      <mesh position={[0, 0.15, -6.0]}>
        <sphereGeometry args={[8.0, 48, 48, Math.PI / 2 - 0.176, 0.352, Math.PI / 2 - 0.125, 0.25]} />
        <meshStandardMaterial
          ref={screenRef}
          color={SCREEN_DARK}
          emissive={SCREEN_GREEN}
          emissiveIntensity={powered ? 0.55 : 0}
          roughness={0.25}
          metalness={0.1}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Scanlines overlay – thin transparent plane just in front of screen */}
      {powered && (
        <mesh position={[0, 0.15, 2.01]}>
          <planeGeometry args={[2.9, 2.1]} />
          <meshBasicMaterial map={scanlineTexture} transparent opacity={0.6} depthWrite={false} />
        </mesh>
      )}

      {/* Faked screen content – DOS prompt (dynamic) */}
      {powered && (
        <Text
          position={[-1.1, 0.55, 2.02]}
          fontSize={0.13}
          color={SCREEN_GREEN}
          anchorX="left"
          anchorY="middle"
        >
          {screenText}
        </Text>
      )}

      {/* CRT inner glow – point light inside monitor case */}
      <pointLight ref={glowRef} position={[0, 0.15, 1.9]} intensity={0.8} color={SCREEN_GREEN} distance={4} />

      {/* Brightness / Contrast knobs */}
      <BrightnessKnob position={[-1.7, -1.35, 1.84]} label="BRIGHT" />
      <BrightnessKnob position={[1.7, -1.35, 1.84]} label="CONTRAST" />

      {/* Power LED on monitor */}
      <mesh position={[0, -1.4, 1.84]}>
        <circleGeometry args={[0.04, 16]} />
        <meshStandardMaterial
          color={powered ? LED_GREEN : '#330'}
          emissive={powered ? LED_GREEN : '#000'}
          emissiveIntensity={powered ? 0.5 : 0}
        />
      </mesh>

      {/* Tilt-swivel base */}
      <mesh position={[0, -1.74, 0.15]}>
        <cylinderGeometry args={[1.0, 1.15, 0.12, 32]} />
        <meshStandardMaterial color={IBM_BEIGE_DARK} roughness={0.7} />
      </mesh>
      <mesh position={[0, -1.66, 0.15]}>
        <cylinderGeometry args={[0.45, 0.6, 0.08, 24]} />
        <meshStandardMaterial color={IBM_BEIGE_DARK} roughness={0.7} />
      </mesh>

      {/* Rear ventilation slots */}
      <group position={[0, 0.2, -1.81]}>
        {[-1.2, -0.8, -0.4, 0, 0.4, 0.8, 1.2].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[2.8, 0.12, 0.04]} />
            <meshStandardMaterial color={KEY_DARK_GREY} roughness={0.9} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

function BrightnessKnob({ position, label }: { position: [number, number, number]; label: string }) {
  return (
    <group position={position}>
      <mesh>
        <cylinderGeometry args={[0.13, 0.13, 0.08, 16]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color={IBM_BEIGE_DARK} roughness={0.6} />
      </mesh>
      <mesh position={[0, 0, 0.05]}>
        <cylinderGeometry args={[0.14, 0.14, 0.06, 24]} />
        <meshStandardMaterial color={KEY_DARK_GREY} roughness={0.5} metalness={0.3} />
      </mesh>
      <mesh position={[0, 0.06, 0.09]} rotation={[0, 0, Math.PI / 2]}>
        <boxGeometry args={[0.08, 0.02, 0.02]} />
        <meshStandardMaterial color={IBM_BEIGE_LIGHT} />
      </mesh>
      <Text position={[0, -0.28, 0.06]} fontSize={0.07} color={IBM_LABEL_GREY} anchorX="center">
        {label}
      </Text>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Keyboard – IBM Model F                                            */
/* ------------------------------------------------------------------ */
function Keyboard({ position, onKeyPress }: { position: [number, number, number]; onKeyPress?: (label: string) => void }) {
  const keys = useMemo(() => {
    const rows: { x: number; z: number; w: number; label?: string }[][] = []
    const allRows: ([string, number])[][] = [
      [['Esc', 1.5], ['1', 1], ['2', 1], ['3', 1], ['4', 1], ['5', 1], ['6', 1], ['7', 1], ['8', 1], ['9', 1], ['0', 1], ['-', 1], ['=', 1], ['←', 2]],
      [['Tab', 2], ['Q', 1], ['W', 1], ['E', 1], ['R', 1], ['T', 1], ['Y', 1], ['U', 1], ['I', 1], ['O', 1], ['P', 1], ['[', 1], [']', 1], ['\\', 2]],
      [['Caps', 2], ['A', 1], ['S', 1], ['D', 1], ['F', 1], ['G', 1], ['H', 1], ['J', 1], ['K', 1], ['L', 1], [';', 1], ["'", 1], ['Enter', 3]],
      [['Shift', 2.5], ['Z', 1], ['X', 1], ['C', 1], ['V', 1], ['B', 1], ['N', 1], ['M', 1], [',', 1], ['.', 1], ['/', 1], ['Shift', 3.5]],
      [['Ctrl', 2], ['Alt', 2], ['Space', 9], ['Alt', 2], ['Caps', 2]],
    ]
    const keyUnit = 0.22
    const startX = -2.2
    allRows.forEach((row, ri) => {
      const built: { x: number; z: number; w: number; label?: string }[] = []
      let cursor = startX
      row.forEach(([label, w]) => {
        const width = w * keyUnit
        built.push({ x: cursor + width / 2, z: ri * 0.24, w: width, label })
        cursor += width
      })
      rows.push(built)
    })
    return rows.flat()
  }, [])

  const fKeys = useMemo(() => {
    const arr: { label: string; z: number }[] = []
    for (let i = 1; i <= 10; i++) arr.push({ label: `F${i}`, z: -0.1 + (i - 1) * 0.24 })
    return arr
  }, [])

  const numPad = useMemo(() => {
    const arr: { x: number; z: number; w: number; label?: string }[] = []
    const layout: ([string, number])[] = [
      ['Num', 1], ['/', 1], ['*', 1], ['-', 1],
      ['7', 1], ['8', 1], ['9', 1], ['+', 1],
      ['4', 1], ['5', 1], ['6', 1], ['', 1],
      ['1', 1], ['2', 1], ['3', 1], ['Ent', 1],
      ['0', 2], ['.', 1], ['', 1],
    ]
    const keyUnit = 0.22
    let col = 0
    let row = 0
    layout.forEach(([label, w]) => {
      const width = w * keyUnit
      arr.push({ x: 2.5 + col * keyUnit + width / 2, z: -0.05 + row * 0.24, w: width, label })
      col += w
      if (col >= 4) { col = 0; row += 1 }
    })
    return arr
  }, [])

  // Keyboard spiral cable – from back of keyboard to back of system unit
  const kbCable = useMemo(
    () =>
      makeCable(
        [
          [-2.0, 0.1, -1.0],
          [-2.4, 0.0, -1.6],
          [-2.6, -0.05, -2.2],
          [-2.4, 0.0, -2.6],
          [-2.0, 0.1, -2.2],
        ],
        0.04
      ),
    []
  )

  return (
    <group position={position} rotation={[-0.12, 0, 0]}>
      {/* Keyboard housing */}
      <RoundedBox args={[5.4, 0.4, 2.4]} radius={0.06} smoothness={3} castShadow receiveShadow>
        <meshStandardMaterial color={IBM_BEIGE} roughness={0.7} />
      </RoundedBox>

      {/* Recessed key well */}
      <mesh position={[0, 0.21, 0]}>
        <boxGeometry args={[5.2, 0.04, 2.2]} />
        <meshStandardMaterial color={IBM_BEIGE_DARK} roughness={0.85} />
      </mesh>

      {/* Function-key column */}
      <group position={[-2.55, 0.24, 0]}>
        {fKeys.map((k, i) => (
          <Key key={`f${i}`} position={[-0.1, 0, k.z]} width={0.22} label={k.label} small onKeyPress={onKeyPress} />
        ))}
      </group>

      {/* Main QWERTY keys */}
      <group position={[0.05, 0.24, -0.85]}>
        {keys.map((k, i) => (
          <Key key={`m${i}`} position={[k.x, 0, k.z]} width={k.w} label={k.label} onKeyPress={onKeyPress} />
        ))}
      </group>

      {/* Numeric keypad */}
      <group position={[0, 0.24, -0.85]}>
        {numPad.map((k, i) => (
          <Key key={`n${i}`} position={[k.x, 0, k.z]} width={k.w} label={k.label} onKeyPress={onKeyPress} />
        ))}
      </group>

      {/* IBM badge */}
      <Text
        position={[2.0, 0.22, 1.15]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.1}
        letterSpacing={0.05}
        color={IBM_LABEL_GREY}
      >
        IBM
      </Text>
      <Text
        position={[-2.0, 0.22, 1.15]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.06}
        color={IBM_LABEL_GREY}
      >
        Model F
      </Text>

      {/* Coiled keyboard cable */}
      <mesh geometry={kbCable} castShadow>
        <meshStandardMaterial color={CABLE_BLACK} roughness={0.7} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Single keycap with sculpted top (interactive: depresses on click)  */
/* ------------------------------------------------------------------ */
function Key({
  position,
  width = 0.22,
  label,
  small = false,
  onKeyPress,
}: {
  position: [number, number, number]
  width?: number
  label?: string
  small?: boolean
  onKeyPress?: (label: string) => void
}) {
  const height = small ? 0.07 : 0.09
  const [pressed, setPressed] = useState(false)
  const [hovered, setHovered] = useState(false)
  const interactive = !!onKeyPress && !!label && label !== ''

  const handleClick = (e: any) => {
    if (!interactive) return
    e.stopPropagation()
    setPressed(true)
    onKeyPress!(label!)
    window.setTimeout(() => setPressed(false), 120)
  }

  return (
    <group
      position={position}
      onPointerDown={handleClick}
      onPointerOver={(e) => { if (interactive) { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer' } }}
      onPointerOut={() => { if (interactive) { setHovered(false); document.body.style.cursor = 'auto' } }}
    >
      <group position={[0, pressed ? -0.04 : 0, 0]}>
        {/* Keycap base */}
        <RoundedBox args={[width - 0.03, height, 0.19]} radius={0.02} smoothness={2} castShadow>
          <meshStandardMaterial
            color={hovered ? IBM_BEIGE_LIGHT : IBM_BEIGE_LIGHT}
            roughness={0.55}
            emissive={hovered ? '#3a3328' : '#000'}
            emissiveIntensity={hovered ? 0.15 : 0}
          />
        </RoundedBox>
        {/* Keycap top surface (slightly recessed for sculpted look) */}
        <mesh position={[0, height / 2 + 0.001, 0]}>
          <boxGeometry args={[width - 0.06, 0.005, 0.16]} />
          <meshStandardMaterial color={IBM_BEIGE} roughness={0.6} />
        </mesh>
        {/* Label */}
        {label && label !== '' && (
          <Text
            position={[0, height / 2 + 0.005, 0]}
            rotation={[-Math.PI / 2, 0, 0]}
            fontSize={small ? 0.055 : 0.065}
            color={IBM_LABEL_GREY}
            anchorX="center"
            anchorY="middle"
          >
            {label}
          </Text>
        )}
      </group>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Floppy diskette on desk                                            */
/* ------------------------------------------------------------------ */
function FloppyDisk({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, 0.3, 0]}>
      <RoundedBox args={[1.1, 0.04, 1.1]} radius={0.02} smoothness={2} castShadow>
        <meshStandardMaterial color={KEY_BLACK} roughness={0.6} />
      </RoundedBox>
      {/* Label sticker */}
      <mesh position={[0, 0.025, 0.15]}>
        <planeGeometry args={[0.8, 0.55]} />
        <meshStandardMaterial color={PAPER_WHITE} roughness={0.9} />
      </mesh>
      <Text position={[0, 0.027, 0.15]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.06} color={IBM_LABEL_GREY} anchorX="center">
        MS-DOS 1.0
      </Text>
      <Text position={[0, 0.027, 0.32]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.04} color={IBM_LABEL_GREY} anchorX="center">
        IBM · 1981 · 160KB
      </Text>
      {/* Metal shutter */}
      <mesh position={[0, 0.022, -0.45]}>
        <boxGeometry args={[0.7, 0.02, 0.3]} />
        <meshStandardMaterial color={BADGE_SILVER} metalness={0.8} roughness={0.3} />
      </mesh>
      {/* Write-protect notch */}
      <mesh position={[0.45, 0.025, 0.4]}>
        <boxGeometry args={[0.08, 0.04, 0.08]} />
        <meshStandardMaterial color={IBM_BEIGE_LIGHT} roughness={0.8} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Stack of paperwork / IBM manual on desk                            */
/* ------------------------------------------------------------------ */
function Paperwork({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, -0.4, 0]}>
      {/* Bottom paper (slightly rotated) */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0.05]} castShadow receiveShadow>
        <planeGeometry args={[1.4, 1.8]} />
        <meshStandardMaterial color={PAPER_WHITE} roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* Top paper */}
      <mesh position={[0.05, 0.03, -0.05]} rotation={[-Math.PI / 2, 0, -0.03]} castShadow receiveShadow>
        <planeGeometry args={[1.4, 1.8]} />
        <meshStandardMaterial color="#efead8" roughness={0.95} side={THREE.DoubleSide} />
      </mesh>
      {/* Manual (thicker book) */}
      <RoundedBox args={[1.0, 0.12, 1.3]} radius={0.01} smoothness={2} position={[0.1, 0.1, 0.1]} castShadow>
        <meshStandardMaterial color="#8b1a1a" roughness={0.7} />
      </RoundedBox>
      {/* Manual title */}
      <Text
        position={[0.1, 0.165, 0.1]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.08}
        color="#f5f1e0"
        anchorX="center"
        anchorY="middle"
      >
        IBM PC
      </Text>
      <Text
        position={[0.1, 0.165, 0.28]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.05}
        color="#f5f1e0"
        anchorX="center"
        anchorY="middle"
      >
        GUIDE TO OPERATIONS
      </Text>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Coffee mug on desk                                                 */
/* ------------------------------------------------------------------ */
function CoffeeMug({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Mug body */}
      <mesh position={[0, 0.18, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.22, 0.19, 0.36, 24]} />
        <meshStandardMaterial color={MUG_WHITE} roughness={0.4} />
      </mesh>
      {/* Mug interior (dark coffee) */}
      <mesh position={[0, 0.32, 0]}>
        <cylinderGeometry args={[0.19, 0.19, 0.04, 24]} />
        <meshStandardMaterial color={COFFEE_BROWN} roughness={0.3} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.24, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.1, 0.035, 8, 16, Math.PI]} />
        <meshStandardMaterial color={MUG_WHITE} roughness={0.4} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Green banker's desk lamp with real light source                    */
/* ------------------------------------------------------------------ */
function DeskLamp({ position, on = true }: { position: [number, number, number]; on?: boolean }) {
  const LAMP_GREEN = '#1f4d2e'
  const LAMP_BRASS = '#b8915a'
  return (
    <group position={position} scale={1.6}>
      {/* Base */}
      <mesh position={[0, 0.04, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.28, 0.32, 0.08, 24]} />
        <meshStandardMaterial color={LAMP_BRASS} metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Stem */}
      <mesh position={[0, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.05, 0.4, 12]} />
        <meshStandardMaterial color={LAMP_BRASS} metalness={0.6} roughness={0.35} />
      </mesh>
      {/* Shade (green banker's lamp) – half cylinder */}
      <mesh position={[0, 0.55, 0.1]} rotation={[0.3, 0, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.28, 0.22, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={LAMP_GREEN} roughness={0.4} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
      {/* Inner shade (cream) */}
      <mesh position={[0, 0.55, 0.1]} rotation={[0.3, 0, 0]}>
        <cylinderGeometry args={[0.185, 0.275, 0.21, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#efe6c8" roughness={0.8} side={THREE.BackSide} />
      </mesh>
      {/* Shade end caps (to close the half-cylinder) */}
      <mesh position={[0, 0.55, 0.21]} rotation={[0.3, 0, 0]}>
        <circleGeometry args={[0.23, 24, 0, Math.PI]} />
        <meshStandardMaterial color={LAMP_GREEN} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.55, 0.0]} rotation={[0.3, 0, 0]}>
        <circleGeometry args={[0.18, 24, 0, Math.PI]} />
        <meshStandardMaterial color={LAMP_GREEN} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
      {/* Bulb glow */}
      {on && (
        <>
          <mesh position={[0, 0.48, 0.15]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color="#fff4d0" emissive="#ffe9a8" emissiveIntensity={2.0} />
          </mesh>
          {/* Real light cast onto desk */}
          <pointLight position={[0, 0.4, 0.3]} intensity={2.0} color="#fff0c0" distance={7} decay={1.2} castShadow />
          {/* Light cone (subtle volumetric) */}
          <mesh position={[0, 0.35, 0.25]} rotation={[0.3, 0, 0]}>
            <coneGeometry args={[0.35, 0.55, 16, 1, true]} />
            <meshBasicMaterial color="#fff0c0" transparent opacity={0.08} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
        </>
      )}
      {/* Pull chain */}
      <mesh position={[0.26, 0.3, 0]}>
        <cylinderGeometry args={[0.005, 0.005, 0.3, 6]} />
        <meshStandardMaterial color={LAMP_BRASS} metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.26, 0.13, 0]}>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshStandardMaterial color={LAMP_BRASS} metalness={0.8} roughness={0.25} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Vintage rotary telephone (desk accessory)                           */
/* ------------------------------------------------------------------ */
function VintagePhone({ position }: { position: [number, number, number] }) {
  const PHONE_BLACK = '#1a1a1a'
  const PHONE_DIAL = '#2a2a2a'
  return (
    <group position={position} scale={1.1}>
      {/* Base */}
      <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.7, 0.24, 0.5]} />
        <meshStandardMaterial color={PHONE_BLACK} roughness={0.5} />
      </mesh>
      {/* Base rounded front */}
      <mesh position={[0, 0.1, 0.26]}>
        <cylinderGeometry args={[0.12, 0.12, 0.24, 16, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color={PHONE_BLACK} roughness={0.5} side={THREE.DoubleSide} />
      </mesh>
      {/* Cradle (where handset rests) */}
      <mesh position={[-0.18, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.08, 12]} />
        <meshStandardMaterial color={PHONE_DIAL} roughness={0.5} />
      </mesh>
      <mesh position={[0.18, 0.28, 0]} castShadow>
        <cylinderGeometry args={[0.05, 0.06, 0.08, 12]} />
        <meshStandardMaterial color={PHONE_DIAL} roughness={0.5} />
      </mesh>
      {/* Handset (resting on cradle) */}
      <mesh position={[0, 0.34, 0]} rotation={[0, 0, 0]} castShadow>
        <capsuleGeometry args={[0.07, 0.45, 8, 16]} />
        <meshStandardMaterial color={PHONE_BLACK} roughness={0.45} />
      </mesh>
      {/* Handset ends (ear/mouth piece bumps) */}
      <mesh position={[-0.27, 0.34, 0]} castShadow>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshStandardMaterial color={PHONE_BLACK} roughness={0.45} />
      </mesh>
      <mesh position={[0.27, 0.34, 0]} castShadow>
        <sphereGeometry args={[0.085, 16, 16]} />
        <meshStandardMaterial color={PHONE_BLACK} roughness={0.45} />
      </mesh>
      {/* Rotary dial (front) */}
      <mesh position={[0, 0.12, 0.265]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.16, 0.16, 0.02, 24]} />
        <meshStandardMaterial color={PHONE_DIAL} metalness={0.3} roughness={0.4} />
      </mesh>
      {/* Dial holes (finger holes) */}
      {Array.from({ length: 10 }).map((_, i) => {
        const angle = (i / 10) * Math.PI * 2 - Math.PI / 2
        const r = 0.1
        return (
          <mesh
            key={i}
            position={[Math.cos(angle) * r, 0.12, 0.265 + Math.sin(angle) * r]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <cylinderGeometry args={[0.018, 0.018, 0.03, 10]} />
            <meshStandardMaterial color="#000" roughness={0.9} />
          </mesh>
        )
      })}
      {/* Coiled cord */}
      <mesh position={[0.35, 0.2, 0.15]} rotation={[0, 0.3, 0.5]} castShadow>
        <torusGeometry args={[0.08, 0.015, 6, 20, Math.PI * 3]} />
        <meshStandardMaterial color={PHONE_DIAL} roughness={0.7} />
      </mesh>
    </group>
  )
}

/* ------------------------------------------------------------------ */
/*  Whole machine assembly                                             */
/* ------------------------------------------------------------------ */
export default function IBMPCModel({
  autoRotate = false,
  powered = true,
  screenText,
  onKeyPress,
  lampOn = true,
}: {
  autoRotate?: boolean
  powered?: boolean
  screenText?: string
  onKeyPress?: (label: string) => void
  lampOn?: boolean
}) {
  const group = useRef<THREE.Group>(null)

  useFrame((_, delta) => {
    if (autoRotate && group.current) {
      group.current.rotation.y += delta * 0.25
    }
  })

  return (
    <group ref={group} position={[0, -1, 0]}>
      {/* Desk surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, DESK_Y, 0]} receiveShadow>
        <planeGeometry args={[20, 14]} />
        <meshStandardMaterial color="#5c4632" roughness={0.9} />
      </mesh>

      {/* System unit */}
      <SystemUnit />

      {/* Monitor */}
      <CRTMonitor position={[0, MON_CENTER_Y, -0.3]} powered={powered} screenText={screenText} />

      {/* Keyboard */}
      <Keyboard position={[0.1, DESK_Y + 0.2, 3.4]} onKeyPress={onKeyPress} />

      {/* Floppy disk on desk */}
      <FloppyDisk position={[3.6, DESK_Y + 0.02, 1.2]} />

      {/* Stack of paperwork + IBM manual on left side of desk */}
      <Paperwork position={[-3.6, DESK_Y + 0.02, 2.0]} />

      {/* Coffee mug on desk (front-right) */}
      <CoffeeMug position={[2.6, DESK_Y + 0.02, 2.8]} />

      {/* Green banker's desk lamp (front-left, illuminating desk) */}
      <DeskLamp position={[-3.0, DESK_Y + 0.02, 1.5]} on={lampOn} />

      {/* Vintage rotary phone (back-right corner) */}
      <VintagePhone position={[2.8, DESK_Y + 0.02, -1.8]} />
    </group>
  )
}

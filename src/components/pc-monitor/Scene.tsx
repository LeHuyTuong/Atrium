'use client'

import { Suspense, useState, useRef, useEffect, useCallback } from 'react'
import { Canvas, useThree, useFrame } from '@react-three/fiber'
import {
  OrbitControls,
  Environment,
  ContactShadows,
  PerspectiveCamera,
  Html,
} from '@react-three/drei'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import IBMPCModel from './IBMPCModel'
import {
  Power,
  RotateCw,
  Maximize2,
  Eye,
  Camera,
  Play,
  Lightbulb,
  RotateCcw,
  Terminal,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  ZoomIn,
} from 'lucide-react'

/* ------------------------------------------------------------------ */
/*  Preset camera positions                                            */
/* ------------------------------------------------------------------ */
type PresetView = 'iso' | 'front' | 'side' | 'top' | 'kb' | 'drive' | 'lamp'

const VIEWS: Record<PresetView, { pos: [number, number, number]; label: string }> = {
  iso: { pos: [8, 5, 9], label: '3/4' },
  front: { pos: [0, 1.5, 11], label: 'Trước' },
  side: { pos: [11, 1.5, 0], label: 'Bên' },
  top: { pos: [0, 11, 0.01], label: 'Trên' },
  kb: { pos: [0.1, 0.5, 6.5], label: '⌨ Phím' },
  drive: { pos: [0, 1.2, 6.5], label: '💾 Ổ' },
  lamp: { pos: [-2.5, 0.8, 4.5], label: '💡 Đèn' },
}

/* ------------------------------------------------------------------ */
/*  Web Audio – retro beeps, key clicks, CRT hum                       */
/* ------------------------------------------------------------------ */
class SoundEngine {
  ctx: AudioContext | null = null
  hum: { osc: OscillatorNode; gain: GainNode } | null = null
  enabled = true

  ensure() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
      } catch {
        /* not supported */
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume()
    return this.ctx
  }

  // Single beep (8-bit style square wave)
  beep(freq = 880, duration = 0.08, type: OscillatorType = 'square', volume = 0.08) {
    if (!this.enabled) return
    const ctx = this.ensure()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = type
    osc.frequency.value = freq
    gain.gain.setValueAtTime(volume, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + duration)
  }

  // Boot beep sequence
  bootBeep() {
    this.beep(523, 0.1, 'square', 0.1) // C5
    setTimeout(() => this.beep(784, 0.15, 'square', 0.1), 120) // G5
  }

  // Key click (very short)
  keyClick() {
    this.beep(1200 + Math.random() * 200, 0.025, 'square', 0.04)
  }

  // Power toggle sound
  powerSound(on: boolean) {
    if (on) {
      this.beep(400, 0.15, 'sawtooth', 0.06)
    } else {
      this.beep(300, 0.25, 'sawtooth', 0.06)
      setTimeout(() => this.beep(150, 0.3, 'sawtooth', 0.04), 100)
    }
  }

  // CRT hum – continuous low drone
  startHum() {
    if (!this.enabled) return
    const ctx = this.ensure()
    if (!ctx || this.hum) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sawtooth'
    osc.frequency.value = 60 // mains hum
    gain.gain.value = 0.008
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    this.hum = { osc, gain }
  }

  stopHum() {
    if (this.hum) {
      try {
        this.hum.osc.stop()
      } catch {
        /* already stopped */
      }
      this.hum = null
    }
  }
}

const sound = new SoundEngine()

/* ------------------------------------------------------------------ */
/*  Camera animator                                                    */
/* ------------------------------------------------------------------ */
function CameraRig({ target }: { target: [number, number, number] }) {
  const { camera } = useThree()
  const targetVec = useRef(new THREE.Vector3(...target))
  const animating = useRef(false)

  useEffect(() => {
    targetVec.current.set(...target)
    animating.current = true
  }, [target])

  useFrame(() => {
    if (animating.current) {
      camera.position.lerp(targetVec.current, 0.08)
      if (camera.position.distanceTo(targetVec.current) < 0.05) {
        camera.position.copy(targetVec.current)
        animating.current = false
      }
    }
  })

  return null
}

/* ------------------------------------------------------------------ */
/*  Hotspot markers                                                    */
/* ------------------------------------------------------------------ */
type Hotspot = {
  id: string
  position: [number, number, number]
  title: string
  desc: string
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'monitor',
    position: [0, 2.6, 2.0],
    title: 'Màn hình CRT IBM 5151',
    desc: 'Phosphor xanh đơn sắc, 350×200. Độ cong đặc trưng của CRT thập niên 80. Bấm "Khởi động" để xem BIOS POST.',
  },
  {
    id: 'systemunit',
    position: [0, 0.75, 2.3],
    title: 'Thân máy (System Unit)',
    desc: 'Chứa mainboard Intel 8088, RAM, 2 ổ mềm 5.25" và nguồn. Vỏ thép "Putty Beige" đặc trưng.',
  },
  {
    id: 'keyboard',
    position: [0.1, -0.55, 3.4],
    title: 'Bàn phím IBM Model F',
    desc: '84 phím, spring buckling. Bấm vào phím bất kỳ (khi máy đã khởi động) để gõ lên màn hình!',
  },
  {
    id: 'floppy',
    position: [-1.25, 0.8, 2.3],
    title: 'Ổ đĩa mềm 5.25"',
    desc: 'Lưu trữ 160 KB/mặt. MS-DOS 1.0 nạp từ đĩa này. Đĩa mềm 5.25" từng là tiêu chuẩn PC.',
  },
  {
    id: 'lamp',
    position: [-3.0, -0.3, 1.5],
    title: 'Đèn bàn banker xanh',
    desc: 'Đèn banker cổ điển với chụp xanh lá và thân đồng. Bật/tắt bằng nút "Đèn" — chiếu ánh sáng thật lên bàn.',
  },
  {
    id: 'disk',
    position: [3.6, -0.7, 1.2],
    title: 'Đĩa mềm MS-DOS 1.0',
    desc: 'Phiên bản hệ điều hành đầu tiên Microsoft cung cấp cho IBM — khởi đầu kỷ nguyên MS-DOS/Windows.',
  },
  {
    id: 'phone',
    position: [2.8, -0.5, -1.8],
    title: 'Điện thoại quay số cổ điển',
    desc: 'Điện thoại quay số (rotary dial) — biểu tượng của văn phòng thập niên 80. Cùng thời với IBM PC 5150.',
  },
]

function HotspotMarker({
  hotspot,
  active,
  onClick,
}: {
  hotspot: Hotspot
  active: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <Html position={hotspot.position} center distanceFactor={10} occlude={false}>
      <button
        onClick={onClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="group relative flex h-6 w-6 items-center justify-center"
        style={{ cursor: 'pointer' }}
      >
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
        <span
          className={`relative inline-flex h-3 w-3 rounded-full border-2 border-white transition-transform ${
            active ? 'scale-150 bg-emerald-300' : hovered ? 'scale-125 bg-emerald-400' : 'bg-emerald-500'
          }`}
        />
      </button>
    </Html>
  )
}

/* ------------------------------------------------------------------ */
/*  Loader                                                             */
/* ------------------------------------------------------------------ */
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-emerald-500/30 border-t-emerald-400" />
        <span className="font-mono text-xs text-emerald-400">Đang nạp mô hình 3D...</span>
      </div>
    </Html>
  )
}

/* ------------------------------------------------------------------ */
/*  Boot sequence script – IBM 5150 BIOS POST + PC-DOS boot            */
/* ------------------------------------------------------------------ */
const BOOT_SCRIPT = `IBM Personal Computer
ROM BIOS Version 1.00
(C) Copyright IBM Corp. 1981

Testing: 16 KB OK
Diskette Drive A: OK
Diskette Drive B: OK

PC-DOS Version 1.00
(C) Copyright IBM Corp. 1981

Current date is Tue 1-01-1980
Enter new date: 12-08-1981
Current time is  0:01:14.32
Enter new time:

A>`

/* ------------------------------------------------------------------ */
/*  DOS command processor – handles typed commands + returns output    */
/* ------------------------------------------------------------------ */
function processCommand(cmd: string): string {
  const trimmed = cmd.trim().toLowerCase()
  if (trimmed === '') return '' // empty enter

  if (trimmed === 'dir') {
    return (
      '\n Volume in drive A is MS-DOS\n Directory of A:\\\n\n' +
      'COMMAND  COM   25307  08-12-1981   1:23a\n' +
      'AUTOEXEC BAT      42  08-12-1981   1:23a\n' +
      'CONFIG   SYS     128  08-12-1981   1:23a\n' +
      '        3 file(s)  25477 bytes\n' +
      '                     204800 bytes free'
    )
  }

  if (trimmed === 'ver') {
    return '\nPC-DOS Version 1.00'
  }

  if (trimmed === 'cls') {
    return '__CLS__' // special: clear screen
  }

  if (trimmed === 'date') {
    return '\nCurrent date is Tue 08-12-1981\nEnter new date (mm-dd-yy):'
  }

  if (trimmed === 'time') {
    return '\nCurrent time is  0:01:14.32\nEnter new time:'
  }

  if (trimmed === 'help') {
    return (
      '\nFor more information on a specific command, type HELP command-name.\n' +
      'DIR    Displays a list of files and subdirectories in a directory.\n' +
      'VER    Displays the MS-DOS version.\n' +
      'CLS    Clears the screen.\n' +
      'DATE   Displays or sets the date.\n' +
      'TIME   Displays or sets the time.\n' +
      'ECHO   Displays messages.\n' +
      'HELP   Provides Help information for MS-DOS commands.'
    )
  }

  if (trimmed.startsWith('echo ')) {
    return '\n' + cmd.slice(5)
  }
  if (trimmed === 'echo') {
    return '\nECHO is on.'
  }

  if (trimmed === 'ibm') {
    return '\nIBM Personal Computer Model 5150\nIntroduced August 12, 1981\nCPU: Intel 8088 @ 4.77 MHz\nBoca Raton, Florida, USA'
  }

  if (trimmed === 'msdos' || trimmed === 'ms-dos') {
    return '\nMS-DOS 1.0 — (C) 1981 Microsoft\nLicensed to IBM as PC-DOS 1.0\nThe beginning of the PC era.'
  }

  // Unknown command — DOS-style error
  return "\nBad command or file name"
}

/* ------------------------------------------------------------------ */
/*  Map a keycap label to a typed character                            */
/* ------------------------------------------------------------------ */
function keyToChar(label: string): string | null {
  // Single-character keys: letters, digits, punctuation
  if (label.length === 1) return label
  switch (label) {
    case 'Space':
      return ' '
    case 'Tab':
      return '    '
    case 'Enter':
    case 'Ent':
      return '\n'
    case '-':
      return '-'
    case '=':
      return '='
    case '/':
      return '/'
    case ',':
      return ','
    case '.':
      return '.'
    case ';':
      return ';'
    case "'":
      return "'"
    case '[':
      return '['
    case ']':
      return ']'
    case '\\':
      return '\\'
    default:
      return null // Shift, Ctrl, Alt, Caps, Esc, F1-F10, Num, ← (backspace handled separately)
  }
}

/* ------------------------------------------------------------------ */
/*  Did You Know facts – rotate on idle screen                         */
/* ------------------------------------------------------------------ */
const DID_YOU_KNOW = [
  'IBM PC 5150 ra mat ngay 12/8/1981 voi gia $1.565',
  'CPU Intel 8088 chay 4.77 MHz — cham hon DT 2024 ~730 lan',
  'RAM chi 16 KB — nho hon 1 anh chup dien thoai',
  'Microsoft cung cap MS-DOS 1.0 cho IBM — buoc ngoat cua MS',
  'Ban phim IBM Model F 84 phim — spring buckling huyen thoai',
  'Boca Raton, Florida — noi IBM Project Chess phat trien PC',
  '6502 bo vi xu ly cua Apple II — doi thu chinh cua IBM PC',
  '5.25" floppy disk: 160 KB — chua du 1 bai hat MP3',
]

/* ------------------------------------------------------------------ */
/*  Scene                                                              */
/* ------------------------------------------------------------------ */
export default function Scene() {
  const [autoRotate, setAutoRotate] = useState(false)
  const [powered, setPowered] = useState(true)
  const [lampOn, setLampOn] = useState(true)
  const [showHotspots, setShowHotspots] = useState(true)
  const [nightMode, setNightMode] = useState(false)
  const [soundOn, setSoundOn] = useState(true)
  const [showHelp, setShowHelp] = useState(false)
  const [activeView, setActiveView] = useState<PresetView>('iso')
  const [camTarget, setCamTarget] = useState<[number, number, number]>(VIEWS.iso.pos)
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null)

  // Boot state machine: 'idle' = normal DOS screen, 'booting' = typing BIOS, 'ready' = prompt ready for input
  const [bootPhase, setBootPhase] = useState<'idle' | 'booting' | 'ready'>('idle')
  const [bootChars, setBootChars] = useState(BOOT_SCRIPT.length) // show full script by default
  const [typedText, setTypedText] = useState('')
  const [screenBuffer, setScreenBuffer] = useState('') // accumulated command output
  const bootTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const controlsRef = useRef<OrbitControlsImpl>(null)

  // Did You Know rotation (idle screen)
  const [dykIndex, setDykIndex] = useState(0)
  useEffect(() => {
    if (bootPhase !== 'ready') return
    const t = setInterval(() => setDykIndex((i) => (i + 1) % DID_YOU_KNOW.length), 8000)
    return () => clearInterval(t)
  }, [bootPhase])

  // Keep sound engine enabled state in sync
  useEffect(() => {
    sound.enabled = soundOn
    if (!soundOn) sound.stopHum()
    else if (powered) sound.startHum()
  }, [soundOn, powered])

  // Blinking cursor
  const [cursor, setCursor] = useState('▌')
  useEffect(() => {
    const t = setInterval(() => setCursor((c) => (c === '▌' ? ' ' : '▌')), 500)
    return () => clearInterval(t)
  }, [])

  // The text shown on the CRT screen
  const screenText =
    bootPhase === 'idle'
      ? 'C:\\>dir\nVolume in drive C is MS-DOS\nDirectory of C:\\\n\nCOMMAND  COM   25307  08-12-81\nAUTOEXEC BAT      42  08-12-81\nCONFIG   SYS     128  08-12-81\n        3 file(s)  25477 bytes\n                      204800 bytes free\n\nC:\\>_'
      : bootPhase === 'booting'
      ? BOOT_SCRIPT.slice(0, bootChars)
      : screenBuffer + 'A>' + typedText + cursor

  // Trigger boot sequence
  const startBoot = useCallback(() => {
    if (bootTimer.current) clearInterval(bootTimer.current)
    setPowered(true)
    setBootPhase('booting')
    setBootChars(0)
    setTypedText('')
    setScreenBuffer('')
    sound.bootBeep()
    let i = 0
    const total = BOOT_SCRIPT.length
    bootTimer.current = setInterval(() => {
      i += 5
      if (i >= total) {
        setBootChars(total)
        if (bootTimer.current) clearInterval(bootTimer.current)
        bootTimer.current = null
        setBootPhase('ready')
        setTypedText('')
        setScreenBuffer('')
        sound.startHum()
      } else {
        setBootChars(i)
      }
    }, 60)
    // Safety fallback: force ready after 8 seconds
    window.setTimeout(() => {
      if (bootTimer.current) {
        clearInterval(bootTimer.current)
        bootTimer.current = null
      }
      setBootChars(total)
      setBootPhase((p) => (p === 'booting' ? 'ready' : p))
      setTypedText('')
      setScreenBuffer('')
      sound.startHum()
    }, 8000)
  }, [])

  // Cleanup boot timer on unmount
  useEffect(() => {
    return () => {
      if (bootTimer.current) clearInterval(bootTimer.current)
      sound.stopHum()
    }
  }, [])

  // Handle keyboard key press (shared by virtual + 3D + physical keyboard)
  const handleKeyPress = useCallback(
    (label: string) => {
      // Only allow typing when boot is complete
      if (bootPhase !== 'ready' || !powered) return

      sound.keyClick()

      if (label === '←') {
        // Backspace
        setTypedText((t) => t.slice(0, -1))
        return
      }
      if (label === 'Enter' || label === 'Ent') {
        const cmd = typedText
        const output = processCommand(cmd)

        if (output === '__CLS__') {
          // Clear screen
          setScreenBuffer('')
          setTypedText('')
          return
        }

        // Build new screen buffer: existing + 'A>' + command + output + '\n'
        const newEntry = 'A>' + cmd + (output ? output : '') + '\n'
        // Keep buffer reasonable (last ~400 chars)
        setScreenBuffer((buf) => {
          const next = buf + newEntry
          return next.length > 600 ? next.slice(-600) : next
        })
        setTypedText('')
        return
      }
      const ch = keyToChar(label)
      if (ch !== null) {
        setTypedText((t) => (t.length < 80 ? t + ch : t))
      }
    },
    [bootPhase, powered, typedText]
  )

  // Physical keyboard support – listen for keydown on window
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Help modal toggle with ?
      if (e.key === '?' || (e.shiftKey && e.key === '/')) {
        e.preventDefault()
        setShowHelp((v) => !v)
        return
      }
      // Escape closes help
      if (e.key === 'Escape' && showHelp) {
        setShowHelp(false)
        return
      }
      if (bootPhase !== 'ready' || !powered) return
      // Don't intercept if user is typing in an input/textarea
      const target = e.target as HTMLElement
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return

      if (e.key === 'Enter') {
        e.preventDefault()
        handleKeyPress('Enter')
      } else if (e.key === 'Backspace') {
        e.preventDefault()
        handleKeyPress('←')
      } else if (e.key === ' ') {
        e.preventDefault()
        handleKeyPress(' ')
      } else if (e.key.length === 1) {
        e.preventDefault()
        handleKeyPress(e.key)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [bootPhase, powered, handleKeyPress, showHelp])

  // Power toggle: turning off cancels boot
  const togglePower = () => {
    setPowered((v) => {
      const nv = !v
      sound.powerSound(nv)
      if (!nv) {
        if (bootTimer.current) clearInterval(bootTimer.current)
        setBootPhase('idle')
        setBootChars(BOOT_SCRIPT.length)
        setTypedText('')
        setScreenBuffer('')
        sound.stopHum()
      } else {
        sound.startHum()
      }
      return nv
    })
  }

  const setView = (v: PresetView) => {
    setActiveView(v)
    setCamTarget(VIEWS[v].pos)
  }

  const resetView = () => {
    setView('iso')
    if (controlsRef.current) {
      controlsRef.current.reset()
    }
  }

  const toggleFullscreen = () => {
    const el = document.getElementById('ibm-3d-canvas')
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  // Screenshot capture – render canvas to PNG and download
  const captureScreenshot = () => {
    const canvas = document.querySelector('#ibm-3d-canvas canvas') as HTMLCanvasElement | null
    if (!canvas) return
    try {
      // Force a render to ensure latest frame
      const url = canvas.toDataURL('image/png')
      const a = document.createElement('a')
      a.href = url
      a.download = `ibm-pc-5150-${Date.now()}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      sound.beep(1000, 0.1, 'square', 0.06)
    } catch (e) {
      // CORS-tainted canvas — fallback: alert
      console.error('Screenshot failed', e)
    }
  }

  // Lighting config based on night mode
  const ambientIntensity = nightMode ? 0.15 : 0.55
  const dirIntensity = nightMode ? 0.3 : 1.6
  const bgColor = nightMode ? '#050505' : '#0a0a0a'

  return (
    <div id="ibm-3d-canvas" className="relative h-full w-full bg-neutral-950" style={{ background: bgColor }}>
      {/* CRT scanline overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-20 opacity-[0.06]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(255,255,255,0.5) 0px, rgba(255,255,255,0.5) 1px, transparent 1px, transparent 3px)',
        }}
      />
      {/* Vignette */}
      <div
        className="pointer-events-none absolute inset-0 z-20"
        style={{
          background: nightMode
            ? 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)'
            : 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)',
        }}
      />

      <Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: false }}>
        <PerspectiveCamera makeDefault position={VIEWS.iso.pos} fov={38} />

        {/* Lighting rig – adapts to day/night mode */}
        <ambientLight intensity={ambientIntensity} />
        <directionalLight
          position={[6, 10, 6]}
          intensity={dirIntensity}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-camera-left={-10}
          shadow-camera-right={10}
          shadow-camera-top={10}
          shadow-camera-bottom={-10}
        />
        <directionalLight position={[-6, 4, -4]} intensity={nightMode ? 0.1 : 0.5} color="#fff4e0" />
        <pointLight position={[0, 3, 6]} intensity={nightMode ? 0.15 : 0.4} color="#fffaee" />

        <Suspense fallback={<Loader />}>
          <IBMPCModel
            autoRotate={autoRotate}
            powered={powered}
            screenText={screenText}
            onKeyPress={handleKeyPress}
            lampOn={lampOn}
          />
          <Environment preset={nightMode ? 'night' : 'apartment'} />
          <ContactShadows
            position={[0, -1.75, 0]}
            opacity={nightMode ? 0.3 : 0.5}
            scale={22}
            blur={2.2}
            far={6}
            color="#2a1f12"
          />
        </Suspense>

        {/* Hotspots */}
        {showHotspots &&
          HOTSPOTS.map((h) => (
            <HotspotMarker
              key={h.id}
              hotspot={h}
              active={activeHotspot?.id === h.id}
              onClick={() => setActiveHotspot(h)}
            />
          ))}

        <CameraRig target={camTarget} />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          minDistance={3}
          maxDistance={18}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI / 2.05}
          target={[0, 0.6, 0]}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>

      {/* ---------- Top-left: status ---------- */}
      <div className="pointer-events-none absolute left-4 top-4 z-30 rounded-lg border border-white/10 bg-black/50 px-3 py-2 text-[11px] text-neutral-300 backdrop-blur">
        <div className="flex items-center gap-2">
          <span
            className={`inline-block h-2 w-2 rounded-full ${
              bootPhase === 'booting'
                ? 'animate-pulse bg-amber-400'
                : bootPhase === 'ready'
                ? 'bg-emerald-400'
                : powered
                ? 'bg-emerald-400'
                : 'bg-red-500'
            }`}
          />
          <span className="font-mono">
            IBM PC 5150 ·{' '}
            {bootPhase === 'booting'
              ? 'BOOTING…'
              : bootPhase === 'ready'
              ? 'READY'
              : powered
              ? 'LIVE 3D'
              : 'OFF'}
          </span>
        </div>
        <p className="mt-1 text-[10px] text-neutral-500">
          🖱 Kéo xoay · Cuộn phóng to ·{' '}
          {bootPhase === 'ready' ? '⌨ Gõ trực tiếp hoặc bấm phím ảo' : 'Chấm xanh xem chi tiết'}
        </p>
      </div>

      {/* ---------- Top-right: preset views ---------- */}
      <div className="absolute right-4 top-4 z-30 flex flex-col gap-1.5">
        <div className="mb-1 flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1 text-[10px] font-mono text-neutral-400 backdrop-blur">
          <Camera className="h-3 w-3" />
          GÓC NHÌN
        </div>
        {(Object.keys(VIEWS) as PresetView[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-md border px-3 py-1.5 text-xs font-medium backdrop-blur transition ${
              activeView === v
                ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                : 'border-white/10 bg-black/50 text-neutral-300 hover:bg-black/70'
            }`}
          >
            {VIEWS[v].label}
          </button>
        ))}
        <button
          onClick={resetView}
          className="mt-1 flex items-center justify-center gap-1.5 rounded-md border border-white/10 bg-black/50 px-3 py-1.5 text-[11px] font-medium text-neutral-300 backdrop-blur transition hover:bg-black/70"
          title="Đặt lại góc nhìn"
        >
          <RotateCcw className="h-3 w-3" />
          Reset
        </button>
      </div>

      {/* ---------- Bottom-left: boot + power + lamp + hotspots ---------- */}
      <div className="absolute bottom-4 left-4 z-30 flex flex-wrap gap-2">
        <button
          onClick={startBoot}
          disabled={bootPhase === 'booting'}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur transition ${
            bootPhase === 'booting'
              ? 'cursor-not-allowed border-amber-500/30 bg-amber-500/5 text-amber-300/50'
              : bootPhase === 'ready'
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
              : 'border-amber-500/50 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20'
          }`}
        >
          {bootPhase === 'booting' ? (
            <>
              <Terminal className="h-3.5 w-3.5 animate-pulse" />
              Booting…
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" />
              {bootPhase === 'ready' ? 'Reboot' : 'Khởi động'}
            </>
          )}
        </button>
        <button
          onClick={togglePower}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur transition ${
            powered
              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
              : 'border-red-500/50 bg-red-500/10 text-red-300 hover:bg-red-500/20'
          }`}
        >
          <Power className="h-3.5 w-3.5" />
          {powered ? 'BẬT' : 'TẮT'}
        </button>
        <button
          onClick={() => setLampOn((v) => !v)}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur transition ${
            lampOn
              ? 'border-yellow-500/50 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20'
              : 'border-white/10 bg-black/50 text-neutral-400 hover:bg-black/70'
          }`}
        >
          <Lightbulb className={`h-3.5 w-3.5 ${lampOn ? 'fill-yellow-300/30' : ''}`} />
          Đèn
        </button>
        <button
          onClick={() => setShowHotspots((v) => !v)}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur transition ${
            showHotspots
              ? 'border-sky-500/50 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20'
              : 'border-white/10 bg-black/50 text-neutral-400 hover:bg-black/70'
          }`}
        >
          <Eye className="h-3.5 w-3.5" />
          {showHotspots ? 'Chấm' : 'Ẩn'}
        </button>
      </div>

      {/* ---------- Bottom-right: night mode + sound + rotate + fullscreen ---------- */}
      <div className="absolute bottom-4 right-4 z-30 flex flex-wrap justify-end gap-2">
        <button
          onClick={() => setNightMode((v) => !v)}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur transition ${
            nightMode
              ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20'
              : 'border-white/10 bg-black/50 text-neutral-300 hover:bg-black/70'
          }`}
          title={nightMode ? 'Chế độ ban đêm' : 'Chế độ ban ngày'}
        >
          {nightMode ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
          {nightMode ? 'Đêm' : 'Ngày'}
        </button>
        <button
          onClick={() => setSoundOn((v) => !v)}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur transition ${
            soundOn
              ? 'border-teal-500/50 bg-teal-500/10 text-teal-300 hover:bg-teal-500/20'
              : 'border-white/10 bg-black/50 text-neutral-400 hover:bg-black/70'
          }`}
          title={soundOn ? 'Âm thanh bật' : 'Âm thanh tắt'}
        >
          {soundOn ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
        </button>
        <button
          onClick={() => setAutoRotate((v) => !v)}
          className={`flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur transition ${
            autoRotate
              ? 'border-purple-500/50 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20'
              : 'border-white/10 bg-black/50 text-neutral-300 hover:bg-black/70'
          }`}
        >
          <RotateCw className={`h-3.5 w-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
          {autoRotate ? 'Xoay' : 'Cố định'}
        </button>
        <button
          onClick={captureScreenshot}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-2 text-xs font-medium text-neutral-300 backdrop-blur transition hover:bg-black/70"
          title="Chụp ảnh màn hình"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={() => setShowHelp(true)}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-2 text-xs font-medium text-neutral-300 backdrop-blur transition hover:bg-black/70"
          title="Phím tắt (?)"
        >
          <span className="font-mono text-xs">?</span>
        </button>
        <button
          onClick={toggleFullscreen}
          className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/50 px-3 py-2 text-xs font-medium text-neutral-300 backdrop-blur transition hover:bg-black/70"
          title="Toàn màn hình"
        >
          <Maximize2 className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* ---------- Help modal ---------- */}
      {showHelp && (
        <div
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="w-[min(92%,460px)] rounded-2xl border border-emerald-500/30 bg-neutral-900 p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="font-mono text-sm font-bold text-emerald-400">PHÍM TẮT &amp; LỆNH DOS</h3>
              <button
                onClick={() => setShowHelp(false)}
                className="rounded-full p-1 text-neutral-400 transition hover:bg-white/10 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3 text-xs text-neutral-300">
              <div>
                <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-emerald-400">Bàn phím vật lý</p>
                <ul className="space-y-0.5 font-mono">
                  <li><span className="text-neutral-500">A-Z, 0-9</span> → Gõ ký tự lên CRT</li>
                  <li><span className="text-neutral-500">Enter</span> → Thực thi lệnh</li>
                  <li><span className="text-neutral-500">Backspace</span> → Xoá ký tự</li>
                  <li><span className="text-neutral-500">Space</span> → Dấu cách</li>
                  <li><span className="text-neutral-500">?</span> → Mở/đóng bảng này</li>
                  <li><span className="text-neutral-500">Esc</span> → Đóng bảng này</li>
                </ul>
              </div>
              <div>
                <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-amber-400">Lệnh DOS hỗ trợ</p>
                <ul className="space-y-0.5 font-mono">
                  <li><span className="text-emerald-400">dir</span> — Liệt kê file</li>
                  <li><span className="text-emerald-400">ver</span> — Phiên bản PC-DOS</li>
                  <li><span className="text-emerald-400">cls</span> — Xoá màn hình</li>
                  <li><span className="text-emerald-400">date</span> — Ngày hiện tại</li>
                  <li><span className="text-emerald-400">time</span> — Giờ hiện tại</li>
                  <li><span className="text-emerald-400">echo &lt;msg&gt;</span> — In thông điệp</li>
                  <li><span className="text-emerald-400">help</span> — Danh sách lệnh</li>
                  <li><span className="text-emerald-400">ibm</span> — Thông tin IBM PC</li>
                  <li><span className="text-emerald-400">msdos</span> — Lịch sử MS-DOS</li>
                </ul>
              </div>
              <div className="border-t border-white/10 pt-2 text-[10px] text-neutral-500">
                Mẹo: bấm “Khởi động” rồi gõ lệnh lên màn hình CRT xanh!
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Hotspot info popup ---------- */}
      {activeHotspot && (
        <div className="absolute bottom-20 left-1/2 z-30 w-[min(90%,420px)] -translate-x-1/2 rounded-xl border border-emerald-500/30 bg-black/85 p-4 text-white shadow-2xl backdrop-blur-md">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-emerald-400">
                  Hotspot
                </span>
              </div>
              <h3 className="text-sm font-semibold">{activeHotspot.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-neutral-300">{activeHotspot.desc}</p>
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              className="shrink-0 rounded-full p-1 text-neutral-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Đóng"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* ---------- Virtual keyboard (visible when ready) ---------- */}
      {bootPhase === 'ready' && powered && (
        <VirtualKeyboard onKeyPress={handleKeyPress} />
      )}

      {/* ---------- Did You Know ticker (ready, idle) ---------- */}
      {bootPhase === 'ready' && powered && typedText.length === 0 && screenBuffer.length < 10 && (
        <div
          key={dykIndex}
          className="pointer-events-none absolute bottom-40 left-1/2 z-20 -translate-x-1/2 animate-[fadeIn_0.6s_ease-out]"
        >
          <div className="flex items-center gap-2 rounded-full border border-emerald-500/30 bg-black/70 px-4 py-1.5 text-[10px] font-mono text-emerald-400 backdrop-blur">
            <span className="text-amber-400">💡 DYK</span>
            <span>{DID_YOU_KNOW[dykIndex]}</span>
          </div>
          <div className="mt-1 text-center text-[9px] text-neutral-500">
            Mẹo: gõ <span className="text-emerald-400">dir</span>, <span className="text-emerald-400">ver</span>, <span className="text-emerald-400">help</span>… hoặc bấm <span className="text-emerald-400">?</span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/*  Virtual keyboard overlay (HTML) – appears when system is ready     */
/*  Allows typing on the CRT screen without clicking tiny 3D keys      */
/* ------------------------------------------------------------------ */
function VirtualKeyboard({ onKeyPress }: { onKeyPress: (label: string) => void }) {
  const rows: string[][] = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Enter'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '←'],
  ]

  return (
    <div className="absolute bottom-16 left-1/2 z-30 -translate-x-1/2 animate-[fadeIn_0.3s_ease-out]">
      <div className="rounded-xl border border-emerald-500/30 bg-black/85 p-2 shadow-2xl backdrop-blur-md">
        <div className="mb-1.5 flex items-center justify-between px-1">
          <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400">
            ⌨ Bàn phím ảo — bấm để gõ
          </span>
        </div>
        <div className="flex flex-col gap-1">
          {rows.map((row, ri) => (
            <div key={ri} className="flex justify-center gap-1">
              {row.map((k) => (
                <button
                  key={k}
                  onClick={() => onKeyPress(k)}
                  className={`min-w-[28px] rounded border px-1.5 py-1 font-mono text-[11px] font-medium transition active:translate-y-px ${
                    k === 'Enter'
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20'
                      : k === '←'
                      ? 'border-red-500/40 bg-red-500/10 text-red-300 hover:bg-red-500/20'
                      : 'border-white/10 bg-white/5 text-neutral-200 hover:bg-white/15 hover:border-white/20'
                  }`}
                >
                  {k === 'Enter' ? '⏎' : k === '←' ? '⌫' : k}
                </button>
              ))}
            </div>
          ))}
          <div className="flex justify-center gap-1">
            <button
              onClick={() => onKeyPress(' ')}
              className="min-w-[120px] rounded border border-white/10 bg-white/5 px-1.5 py-1 font-mono text-[11px] font-medium text-neutral-200 transition hover:bg-white/15 active:translate-y-px"
            >
              SPACE
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

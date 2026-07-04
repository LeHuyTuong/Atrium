"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "./palette";
import type { ChipPartId } from "@/lib/chip-types";

type Props = {
  playing: boolean;
  speed: number;
  selectedPart: ChipPartId | null;
  onPartClick: (id: ChipPartId) => void;
};

// materials helper
const ceramicMat = (highlighted: boolean) => (
  <meshStandardMaterial
    color={highlighted ? palette.chipBodyLight : palette.chipBody}
    roughness={0.8}
    metalness={0.1}
    emissive={highlighted ? palette.accent : "#000000"}
    emissiveIntensity={highlighted ? 0.18 : 0}
  />
);

const metalMat = (color: string, metalness = 0.9, roughness = 0.3) => (
  <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
);

// ===== Pin x-positions — 8 per side, spacing 0.15 =====
const PIN_XS = [-0.525, -0.375, -0.225, -0.075, 0.075, 0.225, 0.375, 0.525];

/** Một chân cắm bạc hình chữ L — phần ngang đi ra ngoài + phần dọc xuống PCB. */
function Pin({
  x,
  side,
  highlighted,
}: {
  x: number;
  side: 1 | -1;
  highlighted: boolean;
}) {
  const zIn = side * 0.25;   // mép trong (sát vỏ chip)
  const zOut = side * 0.32;  // mép ngoài (đi xuống PCB)
  const pinColor = highlighted ? palette.pinsHighlight : palette.pins;
  return (
    <group>
      {/* Phần ngang — đi từ vỏ chip ra ngoài */}
      <mesh position={[x, 0.04, (zIn + zOut) / 2]} castShadow>
        <boxGeometry args={[0.045, 0.025, Math.abs(zOut - zIn)]} />
        {metalMat(pinColor, 0.92, 0.22)}
      </mesh>
      {/* Phần dọc — đi xuống PCB */}
      <mesh position={[x, -0.03, zOut]} castShadow>
        <boxGeometry args={[0.045, 0.16, 0.025]} />
        {metalMat(highlighted ? palette.pinsHighlight : palette.pinsDark, 0.92, 0.28)}
      </mesh>
      {/* Miếng hàn vàng — nơi chân chạm PCB */}
      <mesh position={[x, -0.105, zOut]}>
        <cylinderGeometry args={[0.045, 0.045, 0.018, 16]} />
        {metalMat(highlighted ? palette.chipLabel : palette.solderPad, 0.75, 0.35)}
      </mesh>
    </group>
  );
}

/** Một đường mạch in — phát sáng theo nhịp (data flowing). */
function CircuitTrace({
  position,
  length,
  axis,
  delay,
  highlighted,
  playing,
  speed,
}: {
  position: [number, number, number];
  length: number;
  axis: "x" | "z";
  delay: number;
  highlighted: boolean;
  playing: boolean;
  speed: number;
}) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const tRef = useRef(0);
  useFrame((_, delta) => {
    if (!playing) return;
    tRef.current += delta * speed * 0.6;
    if (matRef.current) {
      // Chu kỳ 2s — sáng đỉnh 0.4s đầu rồi mờ dần
      const phase = (tRef.current + delay) % 2.0;
      const pulse = phase < 0.4 ? 1.6 - phase * 2.2 : 0.25;
      const base = highlighted ? 0.7 : 0.25;
      matRef.current.emissiveIntensity = base + pulse * 0.9;
    }
  });
  const args: [number, number, number] = axis === "z" ? [0.03, 0.006, length] : [length, 0.006, 0.03];
  return (
    <mesh position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial
        ref={matRef}
        color={palette.circuitTrace}
        emissive={palette.circuitTrace}
        emissiveIntensity={0.3}
        roughness={0.4}
        metalness={0.5}
      />
    </mesh>
  );
}

/** Die silicon — phát sáng xanh lá, nhấp nháy chậm (emissiveIntensity 0.3-0.6). */
function SiliconDie({ highlighted, playing, speed }: { highlighted: boolean; playing: boolean; speed: number }) {
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const tRef = useRef(0);
  useFrame((_, delta) => {
    if (!playing) return;
    tRef.current += delta * speed * 0.5;
    if (matRef.current) {
      // nhấp nháy chậm — dao động 0.3 → 0.6
      const t = tRef.current;
      const pulse = 0.45 + Math.sin(t * Math.PI * 2) * 0.15;
      matRef.current.emissiveIntensity = highlighted ? pulse + 0.3 : pulse;
    }
  });
  return (
    <group>
      {/* Khung viền tối quanh die (giống封装 pad) */}
      <mesh position={[0, 0.262, 0]}>
        <boxGeometry args={[0.22, 0.005, 0.22]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Die silicon — nhỏ, phát sáng xanh */}
      <mesh position={[0, 0.268, 0]}>
        <boxGeometry args={[0.16, 0.008, 0.16]} />
        <meshStandardMaterial
          ref={matRef}
          color={palette.silicon}
          emissive={palette.accent}
          emissiveIntensity={0.4}
          roughness={0.5}
          metalness={0.4}
        />
      </mesh>
      {/* Wirebond — 2 dây vàng nối die tới pad */}
      <mesh position={[-0.06, 0.28, 0.04]} rotation={[0, 0, Math.PI / 8]}>
        <cylinderGeometry args={[0.004, 0.004, 0.12, 8]} />
        {metalMat(palette.chipLabel, 0.85, 0.3)}
      </mesh>
      <mesh position={[0.06, 0.28, -0.04]} rotation={[0, 0, -Math.PI / 8]}>
        <cylinderGeometry args={[0.004, 0.004, 0.12, 8]} />
        {metalMat(palette.chipLabel, 0.85, 0.3)}
      </mesh>
    </group>
  );
}

/** Vùng nhãn in lụa — vàng, có gợi ý chữ "intel" + "4004". */
function LabelArea({ highlighted }: { highlighted: boolean }) {
  return (
    <group>
      {/* Nền vàng — silk-screen rectangle */}
      <mesh position={[0, 0.254, 0]}>
        <boxGeometry args={[1.0, 0.008, 0.36]} />
        <meshStandardMaterial
          color={highlighted ? palette.chipLabel : palette.chipLabelDim}
          roughness={0.55}
          metalness={0.4}
          emissive={highlighted ? palette.chipLabel : "#000000"}
          emissiveIntensity={highlighted ? 0.15 : 0}
        />
      </mesh>
      {/* Gợi ý chữ "intel" — 5 vạch nhỏ song song (mô phỏng letterforms) */}
      <group position={[-0.3, 0.26, -0.05]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.012, 0.003, 0.04]} />
          {metalMat("#f5e6b8", 0.4, 0.5)}
        </mesh>
        <mesh position={[0.025, 0, 0]}>
          <boxGeometry args={[0.012, 0.003, 0.06]} />
          {metalMat("#f5e6b8", 0.4, 0.5)}
        </mesh>
        <mesh position={[0.05, 0, 0]}>
          <boxGeometry args={[0.012, 0.003, 0.04]} />
          {metalMat("#f5e6b8", 0.4, 0.5)}
        </mesh>
        <mesh position={[0.075, 0, 0]}>
          <boxGeometry args={[0.012, 0.003, 0.06]} />
          {metalMat("#f5e6b8", 0.4, 0.5)}
        </mesh>
        <mesh position={[0.1, 0, 0]}>
          <boxGeometry args={[0.012, 0.003, 0.04]} />
          {metalMat("#f5e6b8", 0.4, 0.5)}
        </mesh>
      </group>
      {/* Gợi ý chữ "4004" — 4 vạch nhỏ (số) */}
      <group position={[-0.3, 0.26, 0.06]}>
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.014, 0.003, 0.04]} />
          {metalMat("#f5e6b8", 0.4, 0.5)}
        </mesh>
        <mesh position={[0.025, 0, 0]}>
          <boxGeometry args={[0.014, 0.003, 0.04]} />
          {metalMat("#f5e6b8", 0.4, 0.5)}
        </mesh>
        <mesh position={[0.05, 0, 0]}>
          <boxGeometry args={[0.014, 0.003, 0.04]} />
          {metalMat("#f5e6b8", 0.4, 0.5)}
        </mesh>
        <mesh position={[0.075, 0, 0]}>
          <boxGeometry args={[0.014, 0.003, 0.04]} />
          {metalMat("#f5e6b8", 0.4, 0.5)}
        </mesh>
      </group>
    </group>
  );
}

/** Tâm định vị pin 1 (notch) — hình bán nguyệt nhỏ ở một đầu. */
function Notch() {
  return (
    <mesh position={[-0.55, 0.253, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[0.05, 16, 0, Math.PI]} />
      <meshStandardMaterial color="#050505" roughness={0.95} metalness={0} />
    </mesh>
  );
}

export function Intel4004({ playing, speed, selectedPart, onPartClick }: Props) {
  const isSel = (id: ChipPartId) => selectedPart === id;

  // Sinh danh sách 16 chân (8 mỗi bên)
  const pins = useMemo(() => {
    const arr: { x: number; side: 1 | -1 }[] = [];
    PIN_XS.forEach((x) => {
      arr.push({ x, side: 1 });
      arr.push({ x, side: -1 });
    });
    return arr;
  }, []);

  // Sinh 8 mạch in — 4 mỗi bên, xen kẽ pin — đi ra ngoài rồi rẽ
  const traces = useMemo(() => {
    const arr: {
      position: [number, number, number];
      length: number;
      axis: "x" | "z";
      delay: number;
    }[] = [];
    PIN_XS.forEach((x, i) => {
      if (i % 2 !== 0) return; // mỗi chân khác 1 trace
      const side = i < 4 ? 1 : -1;
      const zOut = side * 0.32;
      const delay = (i / 8) * 2.0;
      // Đoạn 1 — đi thẳng ra ngoài (dọc z)
      arr.push({
        position: [x, -0.095, zOut + side * 0.4],
        length: 0.8,
        axis: "z",
        delay,
      });
      // Đoạn 2 — rẽ ngang (dọc x) — chạy về phía rìa PCB
      arr.push({
        position: [x + (i < 4 ? -0.3 : 0.3), -0.095, zOut + side * 0.8],
        length: 0.6,
        axis: "x",
        delay: delay + 0.1,
      });
    });
    return arr;
  }, []);

  return (
    <group>
      {/* ===== Bo mạch in (PCB) — nền xanh đậm ===== */}
      <group
        position={[0, -0.15, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onPartClick("pcb");
        }}
      >
        <mesh receiveShadow castShadow>
          <boxGeometry args={[4, 0.1, 3]} />
          <meshStandardMaterial
            color={isSel("pcb") ? palette.pcbGreenLight : palette.pcbGreen}
            roughness={0.7}
            metalness={0.1}
            emissive={isSel("pcb") ? palette.accent : "#000000"}
            emissiveIntensity={isSel("pcb") ? 0.08 : 0}
          />
        </mesh>
        {/* Viền bo mạch — sáng hơn */}
        <mesh position={[0, 0.051, 1.45]}>
          <boxGeometry args={[3.8, 0.005, 0.04]} />
          {metalMat(palette.solderPad, 0.6, 0.45)}
        </mesh>
        <mesh position={[0, 0.051, -1.45]}>
          <boxGeometry args={[3.8, 0.005, 0.04]} />
          {metalMat(palette.solderPad, 0.6, 0.45)}
        </mesh>
        <mesh position={[1.95, 0.051, 0]}>
          <boxGeometry args={[0.04, 0.005, 2.8]} />
          {metalMat(palette.solderPad, 0.6, 0.45)}
        </mesh>
        <mesh position={[-1.95, 0.051, 0]}>
          <boxGeometry args={[0.04, 0.005, 2.8]} />
          {metalMat(palette.solderPad, 0.6, 0.45)}
        </mesh>
      </group>

      {/* ===== Mạch in (circuit traces) ===== */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onPartClick("traces");
        }}
      >
        {traces.map((t, i) => (
          <CircuitTrace
            key={i}
            position={t.position}
            length={t.length}
            axis={t.axis}
            delay={t.delay}
            highlighted={isSel("traces")}
            playing={playing}
            speed={speed}
          />
        ))}
      </group>

      {/* ===== Chân cắm (16 pins) + miếng hàn ===== */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onPartClick("pins");
        }}
      >
        {pins.map((p, i) => (
          <Pin key={i} x={p.x} side={p.side} highlighted={isSel("pins")} />
        ))}
      </group>

      {/* ===== Vỏ gốm DIP-16 ===== */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onPartClick("package");
        }}
      >
        {/* Thân gốm */}
        <mesh position={[0, 0.125, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.25, 0.5]} />
          {ceramicMat(isSel("package"))}
        </mesh>
        {/* Đường rãnh viền trên (cosmetic) */}
        <mesh position={[0, 0.249, 0]}>
          <boxGeometry args={[1.1, 0.005, 0.42]} />
          <meshStandardMaterial color="#0a0a0a" roughness={0.95} metalness={0} />
        </mesh>
        {/* Notch định vị pin 1 */}
        <Notch />
        {/* Chấm tròn định vị pin 1 (góc trên bên trái) */}
        <mesh position={[-0.5, 0.252, 0.18]}>
          <circleGeometry args={[0.015, 16]} />
          <meshStandardMaterial color="#3a3a3a" roughness={0.8} />
        </mesh>
      </group>

      {/* ===== Vùng nhãn in lụa ===== */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onPartClick("label");
        }}
      >
        <LabelArea highlighted={isSel("label")} />
      </group>

      {/* ===== Silicon die (glowing) ===== */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onPartClick("die");
        }}
      >
        <SiliconDie highlighted={isSel("die")} playing={playing} speed={speed} />
      </group>
    </group>
  );
}

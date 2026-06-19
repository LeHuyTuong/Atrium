"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "./palette";
import type { LoomPartId } from "@/lib/loom-types";

type Props = {
  playing: boolean;
  speed: number;
  selectedPart: LoomPartId | null;
  onPartClick: (id: LoomPartId) => void;
};

// materials helper
const woodMat = (color: string) => (
  <meshStandardMaterial color={color} roughness={0.7} metalness={0.05} />
);
const metalMat = (color: string, metalness = 0.85, roughness = 0.3) => (
  <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} />
);

/** Một thanh gỗ dọc của khung A-frame. */
function FrameSide({ x, onClick, highlighted }: { x: number; onClick: () => void; highlighted: boolean }) {
  return (
    <group
      position={[x, 1.0, 0]}
      onClick={(e) => { e.stopPropagation(); onClick(); }}
      castShadow
    >
      {/* Thanh dọc chính */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[0.12, 2.0, 0.16]} />
        {woodMat(highlighted ? palette.frameWoodLight : palette.frameWood)}
      </mesh>
      {/* Thanh chéo (giữ khung A) */}
      <mesh position={[0, -0.1, 0.3]} rotation={[0.3, 0, 0]} castShadow>
        <boxGeometry args={[0.1, 1.8, 0.12]} />
        {woodMat(palette.frameWood)}
      </mesh>
      {/* Chân giãn rộng */}
      <mesh position={[0, -0.95, 0.15]} castShadow>
        <boxGeometry args={[0.16, 0.12, 0.5]} />
        {woodMat(palette.treadleWood)}
      </mesh>
      {/* Thanh ngang trên */}
      <mesh position={[-x * 0.5, 1.95, 0]} castShadow>
        <boxGeometry args={[Math.abs(x) + 0.12, 0.1, 0.14]} />
        {woodMat(palette.frameWood)}
      </mesh>
    </group>
  );
}

/** Trục gỗ nằm ngang — dùng cho warp beam + cloth beam. */
function WoodenBeam({
  position, radius = 0.16, length = 2.2, onClick, highlighted,
}: {
  position: [number, number, number];
  radius?: number;
  length?: number;
  onClick: () => void;
  highlighted: boolean;
}) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.15;
  });
  return (
    <group position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh ref={ref} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[radius, radius, length, 32]} />
        {woodMat(highlighted ? palette.frameWoodLight : palette.beamWood)}
        {/* vòng bi đồng 2 đầu */}
      </mesh>
      <mesh position={[length / 2 - 0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[radius + 0.02, 0.02, 12, 32]} />
        {metalMat(palette.brass)}
      </mesh>
      <mesh position={[-length / 2 + 0.02, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[radius + 0.02, 0.02, 12, 32]} />
        {metalMat(palette.brass)}
      </mesh>
    </group>
  );
}

/** Các sợi dọc (warp) — căng từ warp beam tới cloth beam, shed mở/đóng. */
function WarpThreads({
  highlighted,
  playing,
  speed,
}: {
  highlighted: boolean;
  playing: boolean;
  speed: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const tRef = useRef(0);
  const threads = useMemo(() => {
    const arr: { z: number; top: boolean; mesh: THREE.Mesh | null }[] = [];
    const count = 24;
    for (let i = 0; i < count; i++) {
      arr.push({ z: -0.45 + (i / (count - 1)) * 0.9, top: i % 2 === 0, mesh: null });
    }
    return arr;
  }, []);
  const meshRefs = useRef<(THREE.Mesh | null)[]>([]);

  useFrame((_, delta) => {
    if (!playing) return;
    tRef.current += delta * speed * 0.8;
    const shedOffset = Math.sin(tRef.current * Math.PI * 2);
    meshRefs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const t = threads[i];
      mesh.position.y = 1.2 + (t.top ? shedOffset * 0.06 : -shedOffset * 0.06);
    });
  });

  return (
    <group ref={groupRef} onClick={(e) => { e.stopPropagation(); (e as any)._loomPart = "warp-threads"; }}>
      {threads.map((t, i) => (
        <mesh
          key={i}
          ref={(el) => { meshRefs.current[i] = el; }}
          position={[0, 1.2, t.z]}
        >
          <boxGeometry args={[0.012, 0.012, 2.1]} />
          <meshStandardMaterial
            color={highlighted ? palette.warpRedLight : palette.warpRed}
            roughness={0.6}
            emissive={palette.warpRed}
            emissiveIntensity={highlighted ? 0.3 : 0.08}
          />
        </mesh>
      ))}
    </group>
  );
}

/** Lá dệt (heddles) — khung có lỗ, nâng/hạ sợi. */
function HeddleHarness({
  x, y, onClick, highlighted,
}: {
  x: number;
  y: number;
  onClick: () => void;
  highlighted: boolean;
}) {
  return (
    <group position={[x, y, 0]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* khung dọc */}
      <mesh castShadow>
        <boxGeometry args={[0.06, 0.7, 0.5]} />
        {metalMat(highlighted ? palette.brass : palette.darkBrass, 0.7, 0.4)}
      </mesh>
      {/* các lá dệt (vertical wires) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const z = -0.2 + (i / 11) * 0.4;
        return (
          <mesh key={i} position={[0, 0, z]}>
            <boxGeometry args={[0.008, 0.6, 0.008]} />
            <meshStandardMaterial color={palette.steel} metalness={0.9} roughness={0.2} />
          </mesh>
        );
      })}
      {/* lỗ eye (giữa mỗi wire) — nhỏ */}
      {Array.from({ length: 6 }).map((_, i) => {
        const z = -0.18 + (i / 5) * 0.36;
        return (
          <mesh key={`e-${i}`} position={[0, 0, z]}>
            <torusGeometry args={[0.018, 0.005, 8, 16]} />
            {metalMat(palette.brass, 0.9, 0.2)}
          </mesh>
        );
      })}
      {/* thanh ngang trên dưới */}
      <mesh position={[0, 0.38, 0]}>
        <boxGeometry args={[0.08, 0.04, 0.52]} />
        {woodMat(palette.frameWood)}
      </mesh>
      <mesh position={[0, -0.38, 0]}>
        <boxGeometry args={[0.08, 0.04, 0.52]} />
        {woodMat(palette.frameWood)}
      </mesh>
    </group>
  );
}

/** Lược đánh (reed) — tấm đồng có nan dọc, đập sợi ngang. */
function Reed({
  position, onClick, highlighted, playing, speed,
}: {
  position: [number, number, number];
  onClick: () => void;
  highlighted: boolean;
  playing: boolean;
  speed: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const tRef = useRef(0);
  useFrame((_, delta) => {
    if (!playing || !ref.current) return;
    tRef.current += delta * speed * 0.8;
    ref.current.position.x = position[0] + Math.abs(Math.sin(tRef.current * Math.PI * 2)) * 0.15;
  });
  return (
    <group ref={ref} position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* khung trên dưới */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <boxGeometry args={[0.08, 0.05, 0.9]} />
        {woodMat(palette.frameWood)}
      </mesh>
      <mesh position={[0, -0.3, 0]} castShadow>
        <boxGeometry args={[0.08, 0.05, 0.9]} />
        {woodMat(palette.frameWood)}
      </mesh>
      {/* nan đồng dọc */}
      {Array.from({ length: 22 }).map((_, i) => {
        const z = -0.42 + (i / 21) * 0.84;
        return (
          <mesh key={i} position={[0, 0, z]}>
            <boxGeometry args={[0.015, 0.58, 0.008]} />
            {metalMat(highlighted ? palette.brass : palette.darkBrass, 0.85, 0.25)}
          </mesh>
        );
      })}
    </group>
  );
}

/** Con thoi (shuttle) — mang sợi ngang, trượt qua shed. */
function Shuttle({
  position, onClick, highlighted, playing, speed,
}: {
  position: [number, number, number];
  onClick: () => void;
  highlighted: boolean;
  playing: boolean;
  speed: number;
}) {
  const ref = useRef<THREE.Group>(null);
  const weftRef = useRef<THREE.Mesh>(null);
  const tRef = useRef(0);
  useFrame((_, delta) => {
    if (!playing || !ref.current) return;
    tRef.current += delta * speed * 0.4;
    const t = (tRef.current % 1);
    const phase = t < 0.5 ? t * 2 : (1 - t) * 2; // 0..1..0
    ref.current.position.x = position[0] + (phase - 0.5) * 1.6;
    if (weftRef.current) {
      const dir = t < 0.5 ? 1 : -1;
      weftRef.current.scale.x = phase * 1.0 + 0.3;
      weftRef.current.position.x = -dir * 0.4;
    }
  });
  return (
    <group ref={ref} position={position} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* thân thoi */}
      <mesh castShadow rotation={[0, 0, Math.PI / 2]}>
        <capsuleGeometry args={[0.05, 0.28, 8, 16]} />
        {woodMat(highlighted ? palette.frameWoodLight : palette.beamWood)}
      </mesh>
      {/* cuộn sợi ngang bên trong */}
      <mesh>
        <cylinderGeometry args={[0.03, 0.03, 0.2, 16]} />
        <meshStandardMaterial color={palette.weftCream} roughness={0.8} />
      </mesh>
      {/* sợi weft kéo theo */}
      <mesh ref={weftRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.0, 0.006, 0.006]} />
        <meshStandardMaterial color={palette.weftCream} roughness={0.8} />
      </mesh>
    </group>
  );
}

/** Bàn đạp chân (treadles). */
function Treadles({
  onClick, highlighted, playing, speed,
}: {
  onClick: () => void;
  highlighted: boolean;
  playing: boolean;
  speed: number;
}) {
  const leftRef = useRef<THREE.Mesh>(null);
  const rightRef = useRef<THREE.Mesh>(null);
  const tRef = useRef(0);
  useFrame((_, delta) => {
    if (!playing) return;
    tRef.current += delta * speed * 0.4;
    const t = (tRef.current % 1);
    if (leftRef.current) leftRef.current.position.y = 0.05 + Math.sin(t * Math.PI * 2) * 0.03;
    if (rightRef.current) rightRef.current.position.y = 0.05 + Math.sin(t * Math.PI * 2 + Math.PI) * 0.03;
  });
  return (
    <group position={[0, 0.05, 0.6]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh ref={leftRef} position={[-0.25, 0.05, 0]} castShadow>
        <boxGeometry args={[0.12, 0.04, 0.7]} />
        {woodMat(highlighted ? palette.frameWoodLight : palette.treadleWood)}
      </mesh>
      <mesh ref={rightRef} position={[0.25, 0.05, 0]} castShadow>
        <boxGeometry args={[0.12, 0.04, 0.7]} />
        {woodMat(highlighted ? palette.frameWoodLight : palette.treadleWood)}
      </mesh>
      {/* trục pivots */}
      <mesh position={[-0.25, 0.1, -0.3]}>
        <cylinderGeometry args={[0.02, 0.02, 0.16, 12]} />
        {metalMat(palette.steel)}
      </mesh>
      <mesh position={[0.25, 0.1, -0.3]}>
        <cylinderGeometry args={[0.02, 0.02, 0.16, 12]} />
        {metalMat(palette.steel)}
      </mesh>
      {/* dây nối lên harness (rope) */}
      <mesh position={[-0.25, 0.5, -0.1]}>
        <cylinderGeometry args={[0.006, 0.006, 0.9, 8]} />
        <meshStandardMaterial color="#3a2410" roughness={0.9} />
      </mesh>
      <mesh position={[0.25, 0.5, -0.1]}>
        <cylinderGeometry args={[0.006, 0.006, 0.9, 8]} />
        <meshStandardMaterial color="#3a2410" roughness={0.9} />
      </mesh>
    </group>
  );
}

/** Vải đã dệt cuộn trên cloth beam. */
function ClothRoll({ highlighted }: { highlighted: boolean }) {
  return (
    <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.12, 0.12, 1.6, 32]} />
      <meshStandardMaterial
        color={highlighted ? palette.weftCream : palette.cloth}
        roughness={0.85}
        metalness={0}
      />
    </mesh>
  );
}

export function PowerLoom({ playing, speed, selectedPart, onPartClick }: Props) {
  const harnessLeft = useRef<THREE.Group>(null);
  const harnessRight = useRef<THREE.Group>(null);
  const tRef = useRef(0);

  useFrame((_, delta) => {
    if (!playing) return;
    tRef.current += delta * speed * 0.8;
    const t = tRef.current;
    if (harnessLeft.current) harnessLeft.current.position.y = 1.3 + Math.sin(t * Math.PI * 2) * 0.08;
    if (harnessRight.current) harnessRight.current.position.y = 1.3 + Math.sin(t * Math.PI * 2 + Math.PI) * 0.08;
  });

  const isSel = (id: LoomPartId) => selectedPart === id;

  return (
    <group position={[0, -0.6, 0]}>
      {/* ===== Khung gỗ 2 bên (A-frame) ===== */}
      <FrameSide x={-1.05} onClick={() => onPartClick("frame")} highlighted={isSel("frame")} />
      <FrameSide x={1.05} onClick={() => onPartClick("frame")} highlighted={isSel("frame")} />
      {/* thanh ngang dưới (gắn 2 chân) */}
      <mesh position={[0, -0.95, 0]} castShadow>
        <boxGeometry args={[2.3, 0.1, 0.14]} />
        {woodMat(palette.frameWood)}
      </mesh>
      <mesh position={[0, -0.95, 0.5]} castShadow>
        <boxGeometry args={[2.3, 0.1, 0.14]} />
        {woodMat(palette.frameWood)}
      </mesh>

      {/* ===== Trục sợi dọc (warp beam) — phía sau ===== */}
      <WoodenBeam position={[0, 1.4, -1.0]} onClick={() => onPartClick("warp-beam")} highlighted={isSel("warp-beam")} />

      {/* ===== Sợi dọc (warp threads) ===== */}
      <WarpThreads highlighted={isSel("warp-threads")} playing={playing} speed={speed} />

      {/* ===== 2 khung lá dệt (harness) — trái + phải, ngược pha ===== */}
      <group ref={harnessLeft} position={[-0.35, 1.3, 0]}>
        <HeddleHarness x={0} y={0} onClick={() => onPartClick("heddles")} highlighted={isSel("heddles") || isSel("harness")} />
      </group>
      <group ref={harnessRight} position={[0.35, 1.3, 0]}>
        <HeddleHarness x={0} y={0} onClick={() => onPartClick("heddles")} highlighted={isSel("heddles") || isSel("harness")} />
      </group>
      {/* thanh trượt dọc (harness guides) */}
      <mesh position={[-0.35, 1.3, 0.3]}>
        <boxGeometry args={[0.04, 0.9, 0.04]} />
        {metalMat(palette.steel, 0.9, 0.2)}
      </mesh>
      <mesh position={[0.35, 1.3, 0.3]}>
        <boxGeometry args={[0.04, 0.9, 0.04]} />
        {metalMat(palette.steel, 0.9, 0.2)}
      </mesh>

      {/* ===== Con thoi (shuttle) — trượt qua shed ===== */}
      <Shuttle
        position={[0, 1.0, 0.3]}
        onClick={() => onPartClick("shuttle")}
        highlighted={isSel("shuttle")}
        playing={playing}
        speed={speed}
      />

      {/* ===== Lược đánh (reed) — đập sợi ngang ===== */}
      <Reed
        position={[0.7, 1.1, 0]}
        onClick={() => onPartClick("reed")}
        highlighted={isSel("reed")}
        playing={playing}
        speed={speed}
      />

      {/* ===== Trục cuộn vải (cloth beam) — phía trước ===== */}
      <group position={[0, 0.8, 1.0]} onClick={(e) => { e.stopPropagation(); onPartClick("cloth-beam"); }}>
        <WoodenBeam position={[0, 0, 0]} onClick={() => onPartClick("cloth-beam")} highlighted={isSel("cloth-beam")} />
        {/* vải cuộn quanh trục */}
        <ClothRoll highlighted={isSel("cloth-beam")} />
      </group>

      {/* ===== Bàn đạp (treadles) ===== */}
      <Treadles onClick={() => onPartClick("treadles")} highlighted={isSel("treadles")} playing={playing} speed={speed} />

      {/* ===== Vải đã dệt nằm ngang (từ reed tới cloth beam) ===== */}
      <mesh position={[0.4, 0.95, 0.5]} rotation={[-0.05, 0, 0]}>
        <boxGeometry args={[0.8, 0.02, 0.6]} />
        <meshStandardMaterial color={palette.cloth} roughness={0.85} />
      </mesh>
    </group>
  );
}

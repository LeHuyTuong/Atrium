"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { palette } from "./palette";
import type { BulbPartId } from "@/lib/bulb-types";

type Props = {
  playing: boolean;
  speed: number;
  selectedPart: BulbPartId | null;
  onPartClick: (id: BulbPartId) => void;
};

/** Trả về true nếu có part khác đang được chọn (→ part này cần dim). */
function isDimmed(id: BulbPartId, selected: BulbPartId | null) {
  return selected !== null && selected !== id;
}

// ============================================================
// GLASS ENVELOPE — vỏ thủy tinh (translucent, không raycast để
// click đi xuyên qua tới các part bên trong)
// ============================================================
function GlassEnvelope({ selected, onClick }: { selected: BulbPartId | null; onClick: () => void }) {
  const isSel = selected === "envelope";
  const dimmed = isDimmed("envelope", selected);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame((_, delta) => {
    if (!matRef.current) return;
    const target = isSel ? 0.45 : dimmed ? 0.04 : 0.18;
    matRef.current.emissiveIntensity = THREE.MathUtils.lerp(
      matRef.current.emissiveIntensity,
      target,
      delta * 3
    );
  });

  return (
    <group position={[0, 0.5, 0]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* vỏ thủy tinh A-shape — sphere scale y 1.1, raycast null để click xuyên qua */}
      <mesh scale={[1, 1.1, 1]} castShadow raycast={() => null}>
        <sphereGeometry args={[0.4, 48, 48]} />
        <meshStandardMaterial
          ref={matRef}
          color={palette.glass}
          transparent
          opacity={dimmed ? 0.14 : 0.25}
          roughness={0.05}
          metalness={0}
          emissive={palette.accent}
          emissiveIntensity={0.18}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* vùng sáng phản chiếu trên thủy tinh */}
      <mesh position={[-0.16, 0.14, 0.3]} scale={[0.45, 0.32, 0.1]} raycast={() => null}>
        <sphereGeometry args={[0.18, 16, 16]} />
        <meshBasicMaterial
          color={palette.glassHighlight}
          transparent
          opacity={dimmed ? 0.08 : 0.18}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// ============================================================
// FILAMENT — sợi đốt (horseshoe tre cácbon hóa) — phát sáng,
// pulse emissiveIntensity, có pointLight bên trong
// ============================================================
function Filament({
  selected,
  playing,
  speed,
  onClick,
}: {
  selected: BulbPartId | null;
  playing: boolean;
  speed: number;
  onClick: () => void;
}) {
  const isSel = selected === "filament";
  const dimmed = isDimmed("filament", selected);
  const lightRef = useRef<THREE.PointLight>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const tRef = useRef(0);

  // Horseshoe curve — CatmullRom qua 7 điểm tạo hình chữ U
  const curve = useMemo(() => {
    const pts = [
      new THREE.Vector3(-0.07, -0.1, 0),
      new THREE.Vector3(-0.07, 0.05, 0),
      new THREE.Vector3(-0.075, 0.13, 0.015),
      new THREE.Vector3(0, 0.17, 0.04),
      new THREE.Vector3(0.075, 0.13, 0.015),
      new THREE.Vector3(0.07, 0.05, 0),
      new THREE.Vector3(0.07, -0.1, 0),
    ];
    return new THREE.CatmullRomCurve3(pts);
  }, []);

  useFrame((_, delta) => {
    if (!playing) return;
    tRef.current += delta * speed * 1.4;
    const pulse = 1.8 + Math.sin(tRef.current * 2) * 0.35; // 1.45 → 2.15
    if (matRef.current) {
      matRef.current.emissiveIntensity = isSel ? pulse + 0.7 : dimmed ? 0.35 : pulse;
    }
    if (lightRef.current) {
      const flicker = 0.85 + Math.sin(tRef.current * 2) * 0.15;
      lightRef.current.intensity = (isSel ? 2.4 : dimmed ? 0.5 : 1.7) * flicker;
    }
  });

  return (
    <group position={[0, 0.45, 0]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* sợi đốt horseshoe */}
      <mesh castShadow>
        <tubeGeometry args={[curve, 64, 0.008, 8, false]} />
        <meshStandardMaterial
          ref={matRef}
          color={palette.filament}
          emissive={palette.filament}
          emissiveIntensity={2.2}
          roughness={0.3}
          metalness={0.1}
          toneMapped={false}
        />
      </mesh>
      {/* 2 đầu sợi nối vào clamp đồng */}
      <mesh position={[-0.07, -0.1, 0]}>
        <sphereGeometry args={[0.012, 12, 12]} />
        <meshStandardMaterial color={palette.baseMetal} metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0.07, -0.1, 0]}>
        <sphereGeometry args={[0.012, 12, 12]} />
        <meshStandardMaterial color={palette.baseMetal} metalness={0.9} roughness={0.3} />
      </mesh>

      {/* pointLight ấm từ filament — illuminate cả scene */}
      <pointLight
        ref={lightRef}
        position={[0, 0.02, 0.02]}
        color={palette.filamentHot}
        intensity={1.7}
        distance={6}
        decay={2}
      />
    </group>
  );
}

// ============================================================
// STEM — trụ thủy tinh giữ filament + 2 dây dẫn điện
// ============================================================
function Stem({ selected, onClick }: { selected: BulbPartId | null; onClick: () => void }) {
  const dimmed = isDimmed("stem", selected);
  const isSel = selected === "stem";

  return (
    <group position={[0, 0.1, 0]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* trụ thủy tinh chính — từ cổ lên trong bóng */}
      <mesh castShadow raycast={() => null}>
        <cylinderGeometry args={[0.035, 0.05, 0.5, 20]} />
        <meshStandardMaterial
          color={palette.stem}
          transparent
          opacity={dimmed ? 0.15 : 0.32}
          roughness={0.1}
          metalness={0}
          emissive={isSel ? palette.accent : "#000000"}
          emissiveIntensity={isSel ? 0.15 : 0}
        />
      </mesh>
      {/* loe thủy tinh nơi trụ gặp bóng */}
      <mesh position={[0, 0.25, 0]} raycast={() => null}>
        <coneGeometry args={[0.08, 0.06, 20]} />
        <meshStandardMaterial color={palette.stem} transparent opacity={dimmed ? 0.15 : 0.32} roughness={0.1} metalness={0} />
      </mesh>
      {/* đế thủy tinh (button seal) ở đáy trụ */}
      <mesh position={[0, -0.25, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.05, 0.045, 0.05, 20]} />
        <meshStandardMaterial color={palette.stem} transparent opacity={dimmed ? 0.2 : 0.4} roughness={0.2} metalness={0} />
      </mesh>

      {/* 2 dây dẫn điện — từ đáy đế lên qua trụ tới filament */}
      <mesh position={[-0.018, 0, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.005, 0.005, 0.55, 8]} />
        <meshStandardMaterial
          color={palette.baseMetal}
          metalness={0.9}
          roughness={0.3}
          emissive={isSel ? palette.accent : "#000000"}
          emissiveIntensity={isSel ? 0.3 : 0}
          transparent={dimmed}
          opacity={dimmed ? 0.5 : 1}
        />
      </mesh>
      <mesh position={[0.018, 0, 0]} raycast={() => null}>
        <cylinderGeometry args={[0.005, 0.005, 0.55, 8]} />
        <meshStandardMaterial
          color={palette.baseMetal}
          metalness={0.9}
          roughness={0.3}
          emissive={isSel ? palette.accent : "#000000"}
          emissiveIntensity={isSel ? 0.3 : 0}
          transparent={dimmed}
          opacity={dimmed ? 0.5 : 1}
        />
      </mesh>
    </group>
  );
}

// ============================================================
// NECK — cổ thủy tinh nối bóng với đế đồng
// ============================================================
function Neck({ selected, onClick }: { selected: BulbPartId | null; onClick: () => void }) {
  const dimmed = isDimmed("neck", selected);
  const isSel = selected === "neck";
  return (
    <group position={[0, -0.15, 0]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <mesh castShadow>
        <cylinderGeometry args={[0.1, 0.13, 0.18, 24]} />
        <meshStandardMaterial
          color={palette.neck}
          transparent
          opacity={dimmed ? 0.22 : 0.42}
          roughness={0.3}
          metalness={0.05}
          emissive={isSel ? palette.accent : "#000000"}
          emissiveIntensity={isSel ? 0.2 : 0}
        />
      </mesh>
    </group>
  );
}

// ============================================================
// BRASS BASE — đế đồng có ren (cylinder + 4 vòng torus)
// ============================================================
function BrassBase({ selected, onClick }: { selected: BulbPartId | null; onClick: () => void }) {
  const dimmed = isDimmed("base", selected);
  const isSel = selected === "base";

  return (
    <group position={[0, -0.35, 0]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* thân đế đồng */}
      <mesh castShadow>
        <cylinderGeometry args={[0.13, 0.13, 0.22, 32]} />
        <meshStandardMaterial
          color={palette.baseMetal}
          metalness={0.9}
          roughness={0.3}
          emissive={isSel ? palette.accent : "#000000"}
          emissiveIntensity={isSel ? 0.3 : 0}
          transparent={dimmed}
          opacity={dimmed ? 0.5 : 1}
        />
      </mesh>
      {/* 4 vòng ren — torus rings quanh thân */}
      {[0.09, 0.03, -0.03, -0.09].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <torusGeometry args={[0.135, 0.013, 8, 32]} />
          <meshStandardMaterial
            color={palette.baseMetal}
            metalness={0.9}
            roughness={0.3}
            emissive={isSel ? palette.accent : "#000000"}
            emissiveIntensity={isSel ? 0.25 : 0}
            transparent={dimmed}
            opacity={dimmed ? 0.5 : 1}
          />
        </mesh>
      ))}
      {/* vành trên nơi đế gặp cổ */}
      <mesh position={[0, 0.13, 0]} castShadow>
        <cylinderGeometry args={[0.14, 0.13, 0.04, 32]} />
        <meshStandardMaterial
          color={palette.baseMetal}
          metalness={0.9}
          roughness={0.25}
          emissive={isSel ? palette.accent : "#000000"}
          emissiveIntensity={isSel ? 0.25 : 0}
          transparent={dimmed}
          opacity={dimmed ? 0.5 : 1}
        />
      </mesh>
    </group>
  );
}

// ============================================================
// INSULATOR — gốm cách điện ở đáy đế
// ============================================================
function Insulator({ selected, onClick }: { selected: BulbPartId | null; onClick: () => void }) {
  const dimmed = isDimmed("insulator", selected);
  const isSel = selected === "insulator";
  return (
    <group position={[0, -0.5, 0]} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      {/* nón gốm đen */}
      <mesh castShadow>
        <coneGeometry args={[0.08, 0.1, 24]} />
        <meshStandardMaterial
          color={palette.baseDark}
          metalness={0.1}
          roughness={0.7}
          emissive={isSel ? palette.accent : "#000000"}
          emissiveIntensity={isSel ? 0.2 : 0}
          transparent={dimmed}
          opacity={dimmed ? 0.5 : 1}
        />
      </mesh>
      {/* chấm tiếp xúc đồng ở đáy */}
      <mesh position={[0, -0.06, 0]}>
        <sphereGeometry args={[0.018, 16, 16]} />
        <meshStandardMaterial
          color={palette.baseMetal}
          metalness={0.9}
          roughness={0.3}
          emissive={isSel ? palette.accent : "#000000"}
          emissiveIntensity={isSel ? 0.25 : 0}
          transparent={dimmed}
          opacity={dimmed ? 0.5 : 1}
        />
      </mesh>
    </group>
  );
}

// ============================================================
// LIGHT BULB — compose toàn bộ 6 part
// ============================================================
export function LightBulb({ playing, speed, selectedPart, onPartClick }: Props) {
  return (
    <group position={[0, 0, 0]}>
      <GlassEnvelope selected={selectedPart} onClick={() => onPartClick("envelope")} />
      <Filament
        selected={selectedPart}
        playing={playing}
        speed={speed}
        onClick={() => onPartClick("filament")}
      />
      <Stem selected={selectedPart} onClick={() => onPartClick("stem")} />
      <Neck selected={selectedPart} onClick={() => onPartClick("neck")} />
      <BrassBase selected={selectedPart} onClick={() => onPartClick("base")} />
      <Insulator selected={selectedPart} onClick={() => onPartClick("insulator")} />
    </group>
  );
}

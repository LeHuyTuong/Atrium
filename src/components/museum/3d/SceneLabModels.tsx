"use client";

import { useRef, type FC, type ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/museum/use-prefers-reduced-motion";

/**
 * Scene Lab — Exploded view of the Watt steam engine (vertical beam engine).
 *
 * Mỗi bộ phận là một nhóm mesh riêng, có thể offset dọc theo hướng tháo rời
 * dựa trên prop `explode` (0 = lắp ráp, 1 = tháo rời hoàn toàn).
 *
 * Đồng bộ với ArtifactModels SteamEngine (Watt beam engine vertical c. 1788).
 */

const ACCENT = "#e89446";
const BRASS = "#b8893f";
const DARK_BRASS = "#7a5a2e";
const IRON = "#3a2a1a";
const WOOD_BROWN = "#5a3a1a";
const STEEL = "#9a9a9a";

export type SteamPartId =
  | "frame"
  | "cylinder"
  | "steam-chest"
  | "condenser"
  | "piston-rod"
  | "walking-beam"
  | "connecting-rod"
  | "crank-gear"
  | "flywheel"
  | "governor"
  | "parallel-motion"
  | "steam-pipes"
  | "steam";

export interface SteamPart {
  id: SteamPartId;
  label: string;
  desc: string;
}

export const STEAM_PARTS: SteamPart[] = [
  { id: "frame", label: "Khung A & bệ máy", desc: "Khung gang chịu lực hình chữ A đỡ toàn bộ động cơ." },
  { id: "cylinder", label: "Xi-lanh đứng", desc: "Buồng hơi thẳng đứng có bọc cách nhiệt, nơi piston chuyển động lên xuống." },
  { id: "steam-chest", label: "Van phân phối hơi", desc: "Cụm van trên đỉnh xi-lanh điều phối hơi nước vào/ra buồng xi-lanh." },
  { id: "condenser", label: "Buồng ngưng tụ riêng", desc: "Phát minh quan trọng nhất của Watt — ngưng tụ hơi riêng biệt giúp tăng hiệu suất gấp 4 lần." },
  { id: "piston-rod", label: "Thanh piston & crosshead", desc: "Truyền lực từ piston lên đòn bẩy walking beam." },
  { id: "walking-beam", label: "Đòn bẩy (walking beam)", desc: "Dầm gỗ lớn có đai kim loại, chuyển động qua lại như cánh bập bênh." },
  { id: "connecting-rod", label: "Tay biên", desc: "Kết nối đòn bẩy với trục khuỷu, chuyển động lắc qua lại." },
  { id: "crank-gear", label: "Trục khuỷu & bánh răng", desc: "Bộ bánh răng mặt trời-hành tinh — phát minh của Watt để tránh vi phạm bản quyền crank." },
  { id: "flywheel", label: "Bánh đà", desc: "Vành đai gang lớn tích lũy quán tính, làm đều chuyển động quay." },
  { id: "governor", label: "Bộ điều tốc ly tâm", desc: "Tự động điều chỉnh van hơi — hai quả nặng quay ly tâm giữ tốc độ ổn định." },
  { id: "parallel-motion", label: "Chuyển động song song", desc: "Cơ cấu bốn khâu Watt giữ thanh piston chuyển động thẳng đứng tuyệt đối." },
  { id: "steam-pipes", label: "Ống dẫn hơi", desc: "Hệ thống ống đồng dẫn hơi nước giữa xi-lanh, buồng ngưng và van." },
  { id: "steam", label: "Hơi nước", desc: "Hơi nước trắng thoát ra từ xi-lanh sau mỗi kỳ xả." },
];

interface ExplodedSteamEngineProps {
  explode: number;
  highlightedPart?: SteamPartId | null;
}

interface PartRenderProps {
  dimmed: boolean;
  highlighted: boolean;
}

interface PartConfig {
  id: SteamPartId;
  offset: [number, number, number];
  label: string;
  labelPosition: [number, number, number];
  Mesh: FC<PartRenderProps>;
}

/* ---- Material helpers ---- */

function mat(color: string, accentEi = 0, metalness = 0.85, roughness = 0.28) {
  return (props: PartRenderProps) => ({
    color,
    metalness,
    roughness,
    emissive: props.highlighted ? ACCENT : "#000000",
    emissiveIntensity: props.highlighted ? accentEi || 0.5 : 0,
    transparent: props.dimmed,
    opacity: props.dimmed ? 0.3 : 1,
  });
}

/* ---------- Mesh components ---------- */

function FramePart(props: PartRenderProps) {
  const m = mat(IRON, 0.2, 0.7, 0.5)(props);
  const braceM = mat("#8a6a2e", 0.25, 0.85, 0.35)(props);
  const capM = mat(DARK_BRASS, 0.3, 0.85, 0.35)(props);
  return (
    <group>
      {/* Base plate */}
      <mesh position={[0, -0.75, 0]} receiveShadow castShadow>
        <boxGeometry args={[4.0, 0.2, 1.4]} />
        <meshStandardMaterial {...m} />
      </mesh>
      {/* Feet */}
      {[-1.8, -0.6, 0.6, 1.8].map((x, i) => (
        <mesh key={i} position={[x, -0.88, 0]} castShadow>
          <boxGeometry args={[0.3, 0.12, 1.2]} />
          <meshStandardMaterial {...m} />
        </mesh>
      ))}
      {/* A-frame legs */}
      <mesh position={[-0.35, 0.1, 0]} rotation={[0, 0, 0.52]} castShadow>
        <boxGeometry args={[0.12, 1.1, 0.35]} />
        <meshStandardMaterial {...m} />
      </mesh>
      <mesh position={[0.35, 0.1, 0]} rotation={[0, 0, -0.52]} castShadow>
        <boxGeometry args={[0.12, 1.1, 0.35]} />
        <meshStandardMaterial {...m} />
      </mesh>
      {/* Cross braces */}
      <mesh position={[-0.2, 0.3, 0]}>
        <boxGeometry args={[0.5, 0.06, 0.14]} />
        <meshStandardMaterial {...braceM} />
      </mesh>
      <mesh position={[-0.25, 0.6, 0]}>
        <boxGeometry args={[0.65, 0.06, 0.14]} />
        <meshStandardMaterial {...braceM} />
      </mesh>
      {/* Top cap */}
      <mesh position={[0, 0.8, 0]} castShadow>
        <boxGeometry args={[0.35, 0.14, 0.32]} />
        <meshStandardMaterial {...capM} />
      </mesh>
    </group>
  );
}

function CylinderPart(props: PartRenderProps) {
  const jacketM = mat("#6a4a22", 0, 0.7, 0.5)(props);
  const bandM = mat("#caa05a", 0.4, 0.85, 0.3)(props);
  const flangeM = mat(IRON, 0.1, 0.7, 0.5)(props);
  const woodM = mat("#3a2410", 0, 0, 0.85)(props);
  const CX = -1.2, CY = 0.45;
  return (
    <group>
      {/* Main cylinder */}
      <mesh position={[CX, CY, 0]} castShadow>
        <cylinderGeometry args={[0.34, 0.38, 0.7, 32]} />
        <meshStandardMaterial {...jacketM} />
      </mesh>
      {/* Insulation lagging */}
      <mesh position={[CX, CY, 0]}>
        <cylinderGeometry args={[0.38, 0.42, 0.66, 24]} />
        <meshStandardMaterial color="#3a2410" roughness={0.85} metalness={0} {...woodM} />
      </mesh>
      {/* Bands */}
      {[-0.28, 0, 0.28].map((y, i) => (
        <mesh key={i} position={[CX, CY + y, 0]}>
          <torusGeometry args={[0.4, 0.025, 8, 24]} />
          <meshStandardMaterial {...bandM} />
        </mesh>
      ))}
      {/* Flanges */}
      <mesh position={[CX, CY - 0.37, 0]} castShadow>
        <cylinderGeometry args={[0.44, 0.46, 0.06, 24]} />
        <meshStandardMaterial {...flangeM} />
      </mesh>
      <mesh position={[CX, CY + 0.37, 0]} castShadow>
        <cylinderGeometry args={[0.42, 0.4, 0.06, 24]} />
        <meshStandardMaterial {...flangeM} />
      </mesh>
      {/* Piston disk inside */}
      <mesh position={[CX, CY, 0]}>
        <cylinderGeometry args={[0.28, 0.28, 0.08, 24]} />
        <meshStandardMaterial {...mat(BRASS, 0.3)(props)} />
      </mesh>
    </group>
  );
}

function SteamChestPart(props: PartRenderProps) {
  const chestM = mat(BRASS, 0.4)(props);
  const topM = mat("#caa05a", 0.3)(props);
  const CX = -1.2, CY = 0.97;
  return (
    <group>
      <mesh position={[CX, CY, 0]} castShadow>
        <boxGeometry args={[0.32, 0.12, 0.2]} />
        <meshStandardMaterial {...chestM} />
      </mesh>
      <mesh position={[CX, CY + 0.1, 0]}>
        <boxGeometry args={[0.4, 0.08, 0.24]} />
        <meshStandardMaterial {...topM} />
      </mesh>
      {/* Valve rod */}
      <mesh position={[CX, CY + 0.2, 0]}>
        <cylinderGeometry args={[0.015, 0.015, 0.06, 8]} />
        <meshStandardMaterial {...mat(STEEL, 0.15, 0.95, 0.2)(props)} />
      </mesh>
    </group>
  );
}

function CondenserPart(props: PartRenderProps) {
  const copperM = mat("#c9762e", 0.2, 0.85, 0.3)(props);
  const capM = mat("#d4884a", 0.25, 0.85, 0.3)(props);
  const ironM = mat(IRON, 0.1, 0.7, 0.5)(props);
  const woodM = mat("#3a2410", 0, 0, 0.85)(props);
  const CX = -1.2;
  return (
    <group>
      {/* Vessel */}
      <mesh position={[CX + 0.2, -0.35, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.22, 0.35, 24]} />
        <meshStandardMaterial {...copperM} />
      </mesh>
      {/* Cap */}
      <mesh position={[CX + 0.2, -0.15, 0]}>
        <cylinderGeometry args={[0.22, 0.2, 0.04, 24]} />
        <meshStandardMaterial {...capM} />
      </mesh>
      {/* Water tank */}
      <mesh position={[CX + 0.2, -0.35, 0.3]}>
        <boxGeometry args={[0.3, 0.2, 0.02]} />
        <meshStandardMaterial color="#3a2410" roughness={0.85} metalness={0} {...woodM} />
      </mesh>
      {/* Air pump */}
      <mesh position={[CX + 0.42, -0.37, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 0.28, 16]} />
        <meshStandardMaterial {...ironM} />
      </mesh>
    </group>
  );
}

function PistonRodPart(props: PartRenderProps) {
  const rodM = mat(STEEL, 0.15, 0.95, 0.2)(props);
  const crossM = mat("#8a6a2e", 0.35)(props);
  const CX = -1.2;
  return (
    <group>
      {/* Rod */}
      <mesh position={[CX, 0.45, 0]} castShadow>
        <cylinderGeometry args={[0.025, 0.035, 0.6, 12]} />
        <meshStandardMaterial {...rodM} />
      </mesh>
      {/* Crosshead */}
      <mesh position={[CX, 0.77, 0]}>
        <boxGeometry args={[0.14, 0.06, 0.18]} />
        <meshStandardMaterial {...crossM} />
      </mesh>
      {/* Pin */}
      <mesh position={[CX, 0.77, 0.12]}>
        <cylinderGeometry args={[0.015, 0.015, 0.04, 8]} />
        <meshStandardMaterial {...rodM} />
      </mesh>
    </group>
  );
}

function WalkingBeamPart(props: PartRenderProps) {
  const beamM = mat("#3a2410", 0, 0, 0.85)(props);
  const strapM = mat("#8a6a2e", 0.25)(props);
  const bearingM = mat(BRASS, 0.45)(props);
  const archM = mat("#9a7a3e", 0.35)(props);
  const woodM = mat(WOOD_BROWN, 0, 0, 0.85)(props);
  const BEAM_PIVOT_Y = 0.88;
  const BEAM_LEFT = -1.15;
  const BEAM_RIGHT = 1.35;
  return (
    <group position={[0, BEAM_PIVOT_Y, 0]}>
      {/* Main beam */}
      <mesh castShadow>
        <boxGeometry args={[-BEAM_LEFT + BEAM_RIGHT, 0.12, 0.28]} />
        <meshStandardMaterial color={WOOD_BROWN} roughness={0.85} metalness={0} {...woodM} />
      </mesh>
      {/* Center reinforcement */}
      <mesh castShadow>
        <boxGeometry args={[-BEAM_LEFT + BEAM_RIGHT, 0.14, 0.14]} />
        <meshStandardMaterial {...beamM} />
      </mesh>
      {/* Strapping top/bottom */}
      {[0.07, -0.07].map((y, i) => (
        <mesh key={i} position={[0, y, 0]}>
          <boxGeometry args={[-BEAM_LEFT + BEAM_RIGHT, 0.02, 0.06]} />
          <meshStandardMaterial {...strapM} />
        </mesh>
      ))}
      {/* Pivot bearing */}
      <mesh castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.35, 16]} />
        <meshStandardMaterial {...bearingM} />
      </mesh>
      {/* Pivot axle */}
      <mesh>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
        <meshStandardMaterial {...mat(STEEL, 0.15, 0.95, 0.2)(props)} />
      </mesh>
      {/* Arch heads */}
      <mesh position={[BEAM_LEFT, 0.08, 0]}>
        <boxGeometry args={[0.16, 0.08, 0.32]} />
        <meshStandardMaterial {...archM} />
      </mesh>
      <mesh position={[BEAM_RIGHT, 0.08, 0]}>
        <boxGeometry args={[0.16, 0.08, 0.32]} />
        <meshStandardMaterial {...archM} />
      </mesh>
      {/* Bolts */}
      {[-0.8, -0.3, 0.3, 0.8].map((x, i) => (
        <mesh key={i} position={[x, 0, 0.15]}>
          <cylinderGeometry args={[0.015, 0.015, 0.02, 8]} />
          <meshStandardMaterial {...mat("#caa05a", 0.55)(props)} />
        </mesh>
      ))}
    </group>
  );
}

function ConnectingRodPart(props: PartRenderProps) {
  return (
    <mesh position={[1.1, 0.5, 0]}>
      <boxGeometry args={[0.05, 0.9, 0.06]} />
      <meshStandardMaterial {...mat(STEEL, 0.15, 0.95, 0.2)(props)} />
    </mesh>
  );
}

function CrankGearPart(props: PartRenderProps) {
  const crankM = mat(IRON, 0.2, 0.7, 0.5)(props);
  const pinM = mat(BRASS, 0.55)(props);
  const sunM = mat(BRASS, 0.4)(props);
  const planetM = mat("#caa05a", 0.4)(props);
  const CX = 1.55, CY = 0.05;
  return (
    <group>
      {/* Crank arm */}
      <mesh position={[CX, CY, 0]} castShadow>
        <boxGeometry args={[0.06, 0.36, 0.08]} />
        <meshStandardMaterial {...crankM} />
      </mesh>
      {/* Crank pin */}
      <mesh position={[CX, CY + 0.18, 0]}>
        <cylinderGeometry args={[0.03, 0.03, 0.12, 8]} />
        <meshStandardMaterial {...pinM} />
      </mesh>
      {/* Sun gear */}
      <mesh position={[CX, CY, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.12, 16]} />
        <meshStandardMaterial {...sunM} />
      </mesh>
      <mesh position={[CX, CY, 0]}>
        <torusGeometry args={[0.13, 0.025, 8, 24]} />
        <meshStandardMaterial {...mat("#9a7a3e", 0.35)(props)} />
      </mesh>
      {/* Planet gear */}
      <mesh position={[CX, CY + 0.28, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.1, 16]} />
        <meshStandardMaterial {...planetM} />
      </mesh>
      <mesh position={[CX, CY + 0.14, 0]}>
        <boxGeometry args={[0.03, 0.28, 0.03]} />
        <meshStandardMaterial {...mat(STEEL, 0.15, 0.95, 0.2)(props)} />
      </mesh>
    </group>
  );
}

function FlywheelPart(props: PartRenderProps) {
  const rimM = mat(DARK_BRASS, 0.15, 0.7, 0.35)(props);
  const hubM = mat("#8a6a2e", 0.3)(props);
  const spokeM = mat("#4a3a2a", 0.15, 0.7, 0.5)(props);
  const FX = 1.8, FY = 0.1;
  return (
    <group position={[FX, FY, 0]} rotation={[0, 0, 0]}>
      {/* Rim */}
      <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.6, 0.06, 16, 48]} />
        <meshStandardMaterial {...rimM} />
      </mesh>
      {/* Hub */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.1, 0.1, 0.2, 24]} />
        <meshStandardMaterial {...hubM} />
      </mesh>
      {/* Spokes */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <mesh key={i} position={[0, Math.cos(a) * 0.35, Math.sin(a) * 0.35]} rotation={[Math.cos(a), 0, 0]}>
            <boxGeometry args={[0.06, 0.5, 0.04]} />
            <meshStandardMaterial {...spokeM} />
          </mesh>
        );
      })}
      {/* Accent ring */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.62, 0.015, 8, 48]} />
        <meshStandardMaterial color={ACCENT} emissive={ACCENT} emissiveIntensity={0.7}
          transparent opacity={props.dimmed ? 0.2 : 0.7} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 0.55, 12]} />
        <meshStandardMaterial {...mat(STEEL, 0.15, 0.95, 0.2)(props)} />
      </mesh>
    </group>
  );
}

function GovernorPart(props: PartRenderProps) {
  const gearM = mat(BRASS, 0.45)(props);
  const armM = mat(STEEL, 0.2, 0.95, 0.2)(props);
  const ballM = mat(BRASS, 0.55)(props);
  const knobM = mat("#caa05a", 0.45)(props);
  return (
    <group position={[0.25, 1.1, 0]}>
      {/* Spindle */}
      <mesh position={[0, 0.15, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 8]} />
        <meshStandardMaterial {...armM} />
      </mesh>
      {/* Bevel gear */}
      <mesh>
        <torusGeometry args={[0.04, 0.015, 6, 12]} />
        <meshStandardMaterial {...gearM} />
      </mesh>
      {/* Flyballs */}
      {[-1, 1].map((side, i) => (
        <group key={i} position={[0, 0.2, 0]} rotation={[0, 0, side * 0.5]}>
          <mesh position={[side * 0.12, -0.05, 0]}>
            <cylinderGeometry args={[0.01, 0.01, 0.25, 6]} />
            <meshStandardMaterial {...armM} />
          </mesh>
          <mesh position={[side * 0.22, -0.16, 0]} castShadow>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial {...ballM} />
          </mesh>
          <mesh position={[side * 0.08, -0.18, 0]}>
            <cylinderGeometry args={[0.008, 0.008, 0.04, 6]} />
            <meshStandardMaterial {...armM} />
          </mesh>
        </group>
      ))}
      {/* Top knob */}
      <mesh position={[0, 0.35, 0]}>
        <sphereGeometry args={[0.03, 10, 10]} />
        <meshStandardMaterial {...knobM} />
      </mesh>
      {/* Throttle rod */}
      <mesh position={[0, -0.15, 0]}>
        <cylinderGeometry args={[0.008, 0.008, 0.15, 6]} />
        <meshStandardMaterial {...armM} />
      </mesh>
    </group>
  );
}

function ParallelMotionPart(props: PartRenderProps) {
  const m = mat(STEEL, 0.15, 0.95, 0.2)(props);
  const CX = -1.2;
  return (
    <group position={[CX, 0.38, 0]}>
      {/* Radius bar */}
      <mesh position={[0.55, 0.32, 0]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[0.55, 0.02, 0.02]} />
        <meshStandardMaterial {...m} />
      </mesh>
      {/* Second radius bar */}
      <mesh position={[0.55, 0.36, 0.06]} rotation={[0, 0, -0.25]}>
        <boxGeometry args={[0.55, 0.015, 0.015]} />
        <meshStandardMaterial {...m} />
      </mesh>
      {/* Linking rod */}
      <mesh position={[0.85, 0.5, 0]} rotation={[0, 0, 0.35]}>
        <boxGeometry args={[0.3, 0.015, 0.015]} />
        <meshStandardMaterial {...m} />
      </mesh>
      {/* Vertical guide bar */}
      <mesh position={[0, 0.2, 0.08]}>
        <boxGeometry args={[0.008, 0.35, 0.008]} />
        <meshStandardMaterial {...m} />
      </mesh>
    </group>
  );
}

function SteamPipesPart(props: PartRenderProps) {
  const m = mat("#8a6a2e", 0.3)(props);
  const m2 = mat(BRASS, 0.35)(props);
  const CX = -1.2, CY = 0.45;
  return (
    <group>
      {/* Pipe cylinder → condenser */}
      <mesh position={[CX + 0.15, -0.05, 0]} rotation={[0, 0, -0.9]}>
        <cylinderGeometry args={[0.02, 0.025, 0.5, 8]} />
        <meshStandardMaterial {...m} />
      </mesh>
      {/* Steam chest side pipe */}
      <mesh position={[CX + 0.3, CY + 0.55, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.015, 0.015, 0.2, 8]} />
        <meshStandardMaterial {...m2} />
      </mesh>
      {/* Condenser pipe */}
      <mesh position={[CX + 0.05, -0.23, 0]} rotation={[0, 0, -0.8]}>
        <cylinderGeometry args={[0.022, 0.025, 0.28, 8]} />
        <meshStandardMaterial {...m} />
      </mesh>
    </group>
  );
}

function SteamPart(props: PartRenderProps) {
  return (
    <group>
      <mesh position={[-1.2, 0.85, 0]}>
        <sphereGeometry args={[0.2, 12, 12]} />
        <meshStandardMaterial
          color="#f0e8d8"
          emissive={props.highlighted ? ACCENT : "#ffffff"}
          emissiveIntensity={props.highlighted ? 0.9 : 0.3}
          transparent
          opacity={props.dimmed ? 0.1 : 0.35}
        />
      </mesh>
      <mesh position={[-1.3, 0.75, 0.1]}>
        <sphereGeometry args={[0.12, 10, 10]} />
        <meshStandardMaterial
          color="#f0ead8"
          emissive={props.highlighted ? ACCENT : "#ffffff"}
          emissiveIntensity={props.highlighted ? 0.7 : 0.2}
          transparent
          opacity={props.dimmed ? 0.08 : 0.25}
        />
      </mesh>
      <mesh position={[-1.1, 0.95, -0.08]}>
        <sphereGeometry args={[0.15, 10, 10]} />
        <meshStandardMaterial
          color="#f0e8d0"
          emissive={props.highlighted ? ACCENT : "#ffffff"}
          emissiveIntensity={props.highlighted ? 0.8 : 0.25}
          transparent
          opacity={props.dimmed ? 0.08 : 0.3}
        />
      </mesh>
    </group>
  );
}

/* ---------- Part configs ---------- */

const PARTS: PartConfig[] = [
  { id: "frame",           offset: [0, -1.2, 0],     label: "Khung A & bệ máy",     labelPosition: [0, -0.2, 0],  Mesh: FramePart },
  { id: "cylinder",        offset: [-2.8, 0, 0],     label: "Xi-lanh đứng",         labelPosition: [-1.2, 1.0, 0],  Mesh: CylinderPart },
  { id: "steam-chest",     offset: [-2.5, 1.2, 0],   label: "Van phân phối hơi",    labelPosition: [-1.2, 1.30, 0], Mesh: SteamChestPart },
  { id: "condenser",       offset: [-2.5, -1.0, 0],  label: "Buồng ngưng tụ",       labelPosition: [-1.0, -0.1, 0], Mesh: CondenserPart },
  { id: "piston-rod",      offset: [-1.8, 1.0, 0],   label: "Thanh piston",         labelPosition: [-1.2, 0.95, 0], Mesh: PistonRodPart },
  { id: "walking-beam",    offset: [0, 1.8, 0],      label: "Đòn bẩy (beam)",       labelPosition: [0, 1.1, 0],    Mesh: WalkingBeamPart },
  { id: "connecting-rod",  offset: [1.8, 1.2, 0],    label: "Tay biên",             labelPosition: [1.1, 0.85, 0], Mesh: ConnectingRodPart },
  { id: "crank-gear",      offset: [2.5, 0.5, 0],    label: "Trục khuỷu & BR",     labelPosition: [1.55, 0.45, 0], Mesh: CrankGearPart },
  { id: "flywheel",        offset: [3.8, 0, 0],      label: "Bánh đà",              labelPosition: [1.8, 0.6, 0],  Mesh: FlywheelPart },
  { id: "governor",        offset: [1.0, 2.4, 0],    label: "Bộ điều tốc",          labelPosition: [0.25, 1.55, 0], Mesh: GovernorPart },
  { id: "parallel-motion", offset: [-1.5, 1.0, 0.5], label: "Chuyển động song song",labelPosition: [-0.6, 0.7, 0], Mesh: ParallelMotionPart },
  { id: "steam-pipes",     offset: [-2.8, 0.8, 0.6], label: "Ống dẫn hơi",          labelPosition: [-1.2, 0.6, 0], Mesh: SteamPipesPart },
  { id: "steam",           offset: [-1.8, 2.0, 0],   label: "Hơi nước",             labelPosition: [-1.2, 1.25, 0], Mesh: SteamPart },
];

/* ---------- Part wrapper: position lerp + label ---------- */

function Part({
  config,
  explode,
  highlightedPart,
}: {
  config: PartConfig;
  explode: number;
  highlightedPart: SteamPartId | null;
}) {
  const ref = useRef<THREE.Group>(null);
  const reduced = usePrefersReducedMotion();
  const target = useRef(new THREE.Vector3());

  const highlighted = highlightedPart === config.id;
  const dimmed = highlightedPart !== null && !highlighted;
  const showLabel = explode > 0.3 && !dimmed;

  useFrame(() => {
    if (!ref.current) return;
    target.current.set(
      config.offset[0] * explode,
      config.offset[1] * explode,
      config.offset[2] * explode
    );
    if (reduced) {
      ref.current.position.copy(target.current);
    } else {
      ref.current.position.lerp(target.current, 0.16);
    }
  });

  const Mesh = config.Mesh;

  return (
    <group ref={ref}>
      <Mesh dimmed={dimmed} highlighted={highlighted} />
      {showLabel && (
        <Html
          center
          distanceFactor={8}
          occlude
          position={config.labelPosition}
          zIndexRange={[40, 0]}
          className="pointer-events-none select-none"
        >
          <div className="flex items-center gap-1.5 -translate-y-1/2 whitespace-nowrap rounded-full border border-amber-300/50 bg-black/85 px-2.5 py-1 text-[0.7rem] font-medium text-amber-100 shadow-lg backdrop-blur-sm">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: ACCENT, boxShadow: `0 0 6px ${ACCENT}` }}
            />
            {config.label}
          </div>
        </Html>
      )}
    </group>
  );
}

/* ---------- Main export ---------- */

export function ExplodedSteamEngine({
  explode,
  highlightedPart = null,
}: ExplodedSteamEngineProps): ReactNode {
  const clamped = Math.max(0, Math.min(1, explode));
  return (
    <group position={[0, 0.1, 0]} scale={1}>
      {PARTS.map((p) => (
        <Part
          key={p.id}
          config={p}
          explode={clamped}
          highlightedPart={highlightedPart}
        />
      ))}
    </group>
  );
}

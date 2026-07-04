"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { palette } from "./palette";
import type { NeuralPartId } from "@/lib/neural-types";

type Props = {
  playing: boolean;
  speed: number;
  selectedPart: NeuralPartId | null;
  onPartClick: (id: NeuralPartId) => void;
};

/**
 * Định nghĩa 4 lớp mạng nơ-ron (AlexNet-style rút gọn 4-6-6-3).
 * Mỗi lớp có: vị trí x, số nơ-ron, bán kính, id, tên hiển thị, màu.
 */
const LAYER_DEFS = [
  { x: -1.8, count: 4, radius: 0.12, id: "input-layer" as NeuralPartId, name: "Input", color: palette.layer1Color },
  { x: -0.6, count: 6, radius: 0.11, id: "hidden-layer-1" as NeuralPartId, name: "Hidden 1", color: palette.layer2Color },
  { x: 0.6, count: 6, radius: 0.11, id: "hidden-layer-2" as NeuralPartId, name: "Hidden 2", color: palette.layer2Color },
  { x: 1.8, count: 3, radius: 0.13, id: "output-layer" as NeuralPartId, name: "Output", color: palette.layer3Color },
];

const BASE_Y = -0.95;
const PHASE_PERIOD = 3.0; // giây cho một forward pass cycle (0..1)

/** Tính vị trí y cho các nơ-ron trong một lớp — đều nhau theo trục y. */
function nodeYPositions(count: number): number[] {
  const spacing = 0.3;
  if (count === 1) return [0];
  const total = (count - 1) * spacing;
  return Array.from({ length: count }, (_, i) => -total / 2 + i * spacing);
}

/**
 * Độ sáng "fire" của một lớp tại thời điểm t (0..1).
 * Mỗi lớp i đạt peak tại t = i/4 (input fire đầu, rồi hidden1, hidden2, output).
 * Dùng gaussian để peak sắc, mượt — có wrap-around vì t lặp vòng 0→1.
 */
function fireIntensity(t: number, peakTime: number): number {
  let dt = Math.abs(t - peakTime);
  if (dt > 0.5) dt = 1 - dt; // wrap quanh vòng tròn 0..1
  const baseline = 0.2;
  const peak = 1.7;
  return baseline + peak * Math.exp(-Math.pow(dt * 14, 2));
}

type LayerInfo = (typeof LAYER_DEFS)[number] & { ys: number[] };

type ConnectionMeshInfo = {
  position: [number, number, number];
  quaternion: [number, number, number, number];
  length: number;
  groupIdx: number;
};

type PulseInfo = {
  from: THREE.Vector3;
  to: THREE.Vector3;
  groupIdx: number;
  phaseOffset: number;
};

/** Lớp nền tĩnh — đế tròn tối + vòng màu cho mỗi lớp. */
function BasePlatform({ layers }: { layers: LayerInfo[] }) {
  return (
    <group>
      {/* Đế tròn */}
      <mesh position={[0, BASE_Y, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <cylinderGeometry args={[2.7, 2.7, 0.06, 64]} />
        <meshStandardMaterial color={palette.floorColor} roughness={0.85} metalness={0.15} />
      </mesh>
      {/* Vòng màu beneath mỗi lớp */}
      {layers.map((layer, i) => (
        <mesh
          key={i}
          position={[layer.x, BASE_Y + 0.035, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[0.32, 0.4, 48]} />
          <meshBasicMaterial color={layer.color} transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Nhãn lớp (Html text) */}
      {layers.map((layer, i) => (
        <Html
          key={i}
          position={[layer.x, BASE_Y - 0.16, 0]}
          center
          distanceFactor={9}
          occlude={false}
          zIndexRange={[15, 0]}
        >
          <div
            style={{
              color: layer.color,
              fontSize: "10px",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              textShadow: "0 0 8px rgba(0,0,0,0.85), 0 0 16px rgba(232,121,249,0.35)",
              whiteSpace: "nowrap",
              fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
            }}
          >
            {layer.name}
          </div>
        </Html>
      ))}
    </group>
  );
}

export function NeuralNet({ playing, speed, selectedPart, onPartClick }: Props) {
  const tRef = useRef(0);

  // === Build layer info, connections, pulses (useMemo — ổn định qua các frame) ===
  const layers = useMemo<LayerInfo[]>(
    () => LAYER_DEFS.map((def) => ({ ...def, ys: nodeYPositions(def.count) })),
    []
  );

  // Cumulative offset cho global node index (dùng trong callback ref)
  const layerNodeOffsets = useMemo(() => {
    const offsets: number[] = [];
    let cum = 0;
    layers.forEach((l) => {
      offsets.push(cum);
      cum += l.ys.length;
    });
    return offsets;
  }, [layers]);

  // 78 connections: mỗi cặp (layer i, layer i+1) fully connected
  const connectionMeshes = useMemo<ConnectionMeshInfo[]>(() => {
    const arr: ConnectionMeshInfo[] = [];
    const up = new THREE.Vector3(0, 1, 0);
    for (let i = 0; i < layers.length - 1; i++) {
      const fromLayer = layers[i];
      const toLayer = layers[i + 1];
      for (const fy of fromLayer.ys) {
        for (const ty of toLayer.ys) {
          const from = new THREE.Vector3(fromLayer.x, fy, 0);
          const to = new THREE.Vector3(toLayer.x, ty, 0);
          const dir = new THREE.Vector3().subVectors(to, from);
          const length = dir.length();
          const mid = new THREE.Vector3().addVectors(from, to).multiplyScalar(0.5);
          const quat = new THREE.Quaternion().setFromUnitVectors(up, dir.clone().normalize());
          arr.push({
            position: [mid.x, mid.y, mid.z],
            quaternion: [quat.x, quat.y, quat.z, quat.w],
            length,
            groupIdx: i,
          });
        }
      }
    }
    return arr;
  }, [layers]);

  // Pulses: 14 pulses per inter-layer transition (42 total)
  const pulses = useMemo<PulseInfo[]>(() => {
    const arr: PulseInfo[] = [];
    for (let i = 0; i < layers.length - 1; i++) {
      const fromLayer = layers[i];
      const toLayer = layers[i + 1];
      const numPulses = 14;
      for (let p = 0; p < numPulses; p++) {
        const fy = fromLayer.ys[p % fromLayer.ys.length];
        const ty = toLayer.ys[p % toLayer.ys.length];
        arr.push({
          from: new THREE.Vector3(fromLayer.x, fy, 0),
          to: new THREE.Vector3(toLayer.x, ty, 0),
          groupIdx: i,
          phaseOffset: (p / numPulses) * 0.2,
        });
      }
    }
    return arr;
  }, [layers]);

  // === Refs for per-mesh materials (callback refs, mutated in useFrame) ===
  // Mỗi mesh có material riêng (inline JSX), không share — đơn giản và lint-clean.
  const nodeMatRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const connMatRefs = useRef<(THREE.MeshStandardMaterial | null)[]>([]);
  const pulseMeshRefs = useRef<(THREE.Mesh | null)[]>([]);

  // === Animation — forward pass cycle ===
  useFrame((_, delta) => {
    if (playing) {
      // Khi data-flow được chọn, pulse chạy nhanh hơn
      const pulseBoost = selectedPart === "data-flow" ? 2.0 : 1.0;
      tRef.current = (tRef.current + (delta * speed * pulseBoost) / PHASE_PERIOD) % 1;
    }
    const t = tRef.current;

    // === Node fire intensity per layer ===
    const layerIds: NeuralPartId[] = [
      "input-layer",
      "hidden-layer-1",
      "hidden-layer-2",
      "output-layer",
    ];
    const anyLayerSelected = layerIds.includes(selectedPart as NeuralPartId);
    for (let i = 0; i < LAYER_DEFS.length; i++) {
      const peakTime = i / 4;
      let intensity = fireIntensity(t, peakTime);
      if (selectedPart === LAYER_DEFS[i].id) {
        intensity = Math.max(intensity, 1.8); // boost lớp đang chọn
      } else if (anyLayerSelected) {
        intensity *= 0.35; // dim các lớp khác
      }
      // Apply cho tất cả nơ-ron trong lớp i
      const start = layerNodeOffsets[i];
      const end = start + layers[i].ys.length;
      for (let j = start; j < end; j++) {
        const mat = nodeMatRefs.current[j];
        if (mat) mat.emissiveIntensity = intensity;
      }
    }

    // === Connection brightness — group i active trong phase [i/4, (i+1)/4] ===
    for (let i = 0; i < connectionMeshes.length; i++) {
      const c = connectionMeshes[i];
      const phaseStart = c.groupIdx / 4;
      const phaseEnd = (c.groupIdx + 1) / 4;
      let activeFactor = 0;
      if (t >= phaseStart && t < phaseEnd) activeFactor = 1;
      let intensity = 0.15 + activeFactor * 1.3;
      let opacity = 0.5 + activeFactor * 0.4;
      if (selectedPart === "connections") {
        intensity = Math.max(intensity, 1.5);
        opacity = 0.95;
      }
      const mat = connMatRefs.current[i];
      if (mat) {
        mat.emissiveIntensity = intensity;
        mat.opacity = opacity;
      }
    }

    // === Pulses — position interpolation + visibility ===
    for (let i = 0; i < pulses.length; i++) {
      const pulse = pulses[i];
      const mesh = pulseMeshRefs.current[i];
      if (!mesh) continue;
      const phaseStart = pulse.groupIdx / 4 + pulse.phaseOffset;
      const phaseEnd = (pulse.groupIdx + 1) / 4 + pulse.phaseOffset;
      const duration = phaseEnd - phaseStart;
      // elapsed = khoảng cách từ phaseStart, có wrap-around
      let elapsed = t - phaseStart;
      if (elapsed < 0) elapsed += 1;
      if (elapsed <= duration && duration > 0) {
        const p = elapsed / duration;
        mesh.visible = true;
        mesh.position.lerpVectors(pulse.from, pulse.to, p);
        // Pulse nhỏ dần khi gần đích
        const scale = 1 - p * 0.4;
        mesh.scale.setScalar(scale);
      } else {
        mesh.visible = false;
      }
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* ===== Đế + nhãn lớp ===== */}
      <BasePlatform layers={layers} />

      {/* ===== Connections (78 cylinders) ===== */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onPartClick("connections");
        }}
      >
        {connectionMeshes.map((c, i) => (
          <mesh
            key={i}
            position={c.position}
            quaternion={c.quaternion}
          >
            <cylinderGeometry args={[0.006, 0.006, c.length, 6]} />
            <meshStandardMaterial
              ref={(el) => {
                connMatRefs.current[i] = el;
              }}
              color={palette.connectionOff}
              emissive={palette.connectionOn}
              emissiveIntensity={0.15}
              transparent
              opacity={0.5}
              roughness={0.5}
              metalness={0.1}
            />
          </mesh>
        ))}
      </group>

      {/* ===== Nodes per layer (19 spheres) ===== */}
      {layers.map((layer, layerIdx) => (
        <group
          key={layer.id}
          onClick={(e) => {
            e.stopPropagation();
            onPartClick(layer.id);
          }}
        >
          {layer.ys.map((y, nodeIdx) => {
            const globalIdx = layerNodeOffsets[layerIdx] + nodeIdx;
            return (
              <group key={nodeIdx} position={[layer.x, y, 0]}>
                {/* Halo mờ ngoài */}
                <mesh scale={1.8}>
                  <sphereGeometry args={[layer.radius, 16, 16]} />
                  <meshBasicMaterial color={layer.color} transparent opacity={0.07} depthWrite={false} />
                </mesh>
                {/* Thân nơ-ron — material modulated per-frame */}
                <mesh castShadow>
                  <sphereGeometry args={[layer.radius, 24, 24]} />
                  <meshStandardMaterial
                    ref={(el) => {
                      nodeMatRefs.current[globalIdx] = el;
                    }}
                    color={layer.color}
                    emissive={palette.nodeOn}
                    emissiveIntensity={0.5}
                    roughness={0.35}
                    metalness={0.15}
                  />
                </mesh>
                {/* Lõi trắng nóng — luôn sáng */}
                <mesh scale={0.42}>
                  <sphereGeometry args={[layer.radius, 12, 12]} />
                  <meshBasicMaterial color={palette.nodeCore} toneMapped={false} transparent opacity={0.9} />
                </mesh>
              </group>
            );
          })}
        </group>
      ))}

      {/* ===== Data pulses (42 small bright spheres) ===== */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onPartClick("data-flow");
        }}
      >
        {pulses.map((_, i) => (
          <mesh
            key={i}
            ref={(el) => {
              pulseMeshRefs.current[i] = el;
            }}
            visible={false}
          >
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshBasicMaterial color={palette.dataPulse} toneMapped={false} />
          </mesh>
        ))}
      </group>
    </group>
  );
}

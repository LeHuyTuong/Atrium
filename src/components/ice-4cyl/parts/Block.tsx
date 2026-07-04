"use client";

import * as THREE from "three";
import { makeCastIron, makeCastAluminum, makeAluminum, makeHighlight } from "../materials";
import { ENGINE_GEOMETRY } from "../kinematics";

const NUM = ENGINE_GEOMETRY.numCylinders;
const SPACING = ENGINE_GEOMETRY.cylinderSpacing;
const BORE = ENGINE_GEOMETRY.bore;
const DECK_H = ENGINE_GEOMETRY.deckHeight;

export interface BlockProps {
  crossSection: boolean;
  highlight: boolean;
  onSelect: (id: string) => void;
}

export function Block({ crossSection, highlight, onSelect }: BlockProps) {
  const mat = highlight ? makeHighlight() : makeCastIron();
  const alMat = makeCastAluminum();
  const halfLen = ((NUM - 1) * SPACING) / 2 + 0.5;

  return (
    <group
      onClick={(e) => {
        e.stopPropagation();
        onSelect("block");
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        document.body.style.cursor = "auto";
      }}
    >
      {crossSection ? (
        <>
          <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, DECK_H / 2, 0]} castShadow>
            <cylinderGeometry args={[halfLen, halfLen, DECK_H, 40, 1, true, -Math.PI / 2, Math.PI]} />
            <meshStandardMaterial color="#3a3d42" metalness={0.85} roughness={0.55} side={THREE.BackSide} />
          </mesh>
          <mesh position={[0, DECK_H, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[BORE / 2, halfLen, 40, 1, -Math.PI / 2, Math.PI]} />
            <meshStandardMaterial color="#5a3a22" side={THREE.DoubleSide} />
          </mesh>
          <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[BORE / 2, halfLen, 40, 1, -Math.PI / 2, Math.PI]} />
            <meshStandardMaterial color="#5a3a22" side={THREE.DoubleSide} />
          </mesh>
          <CylinderBores cut={crossSection} />
          <WaterJacketSections cut={crossSection} />
        </>
      ) : (
        <>
          <mesh position={[0, DECK_H / 2, 0]} castShadow receiveShadow>
            <boxGeometry args={[halfLen * 2, DECK_H, halfLen * 2]} />
            <primitive object={mat} attach="material" />
          </mesh>
          <CylinderBores cut={false} />
          <WaterJacketSections cut={false} />
        </>
      )}

      <mesh position={[0, DECK_H, 0]} receiveShadow>
        <boxGeometry args={[halfLen * 2 - 0.2, 0.12, halfLen * 2 - 0.2]} />
        <primitive object={alMat} attach="material" />
      </mesh>

      <CylinderHeadStuds />
      <MainBearingBulks />
    </group>
  );
}

function CylinderBores({ cut }: { cut: boolean }) {
  const halfSpan = ((NUM - 1) * SPACING) / 2;
  return (
    <group>
      {Array.from({ length: NUM }).map((_, i) => {
        const z = (i - (NUM - 1) / 2) * SPACING;
        return (
          <mesh key={`bore-${i}`} position={[0, DECK_H / 2, z]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            {cut ? (
              <cylinderGeometry args={[BORE / 2, BORE / 2, DECK_H, 32, 1, true, Math.PI / 2, Math.PI]} />
            ) : (
              <cylinderGeometry args={[BORE / 2, BORE / 2, DECK_H, 32, 1, true]} />
            )}
            <meshStandardMaterial color={cut ? "#2a2d31" : "#2a2d31"} side={cut ? THREE.BackSide : THREE.DoubleSide} />
          </mesh>
        );
      })}
    </group>
  );
}

function WaterJacketSections({ cut }: { cut: boolean }) {
  if (!cut) return null;
  return null;
}

function CylinderHeadStuds() {
  const halfSpan = ((NUM - 1) * SPACING) / 2;
  const studPositions: [number, number, number][] = [];
  for (let i = 0; i < NUM; i++) {
    const z = (i - (NUM - 1) / 2) * SPACING;
    studPositions.push([-0.35, DECK_H + 0.06, z - 0.25]);
    studPositions.push([0.35, DECK_H + 0.06, z + 0.25]);
    studPositions.push([-0.35, DECK_H + 0.06, z + 0.25]);
    studPositions.push([0.35, DECK_H + 0.06, z - 0.25]);
  }
  return (
    <group>
      {studPositions.map((pos, i) => (
        <mesh key={`stud-${i}`} position={pos} castShadow>
          <cylinderGeometry args={[0.025, 0.025, 0.6, 8]} />
          <meshStandardMaterial color="#8a9099" metalness={1} roughness={0.3} />
        </mesh>
      ))}
    </group>
  );
}

function MainBearingBulks() {
  return (
    <group>
      {[-0.5, 0, 0.5].map((zOff) => {
        const z = zOff * SPACING;
        return (
          <mesh key={`bulk-${zOff}`} position={[0, 0.2, z]} castShadow>
            <boxGeometry args={[0.6, 0.4, 0.15]} />
            <primitive object={makeCastIron()} attach="material" />
          </mesh>
        );
      })}
    </group>
  );
}

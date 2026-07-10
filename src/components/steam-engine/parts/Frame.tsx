"use client";

import * as THREE from "three";
import { makeCastIron, makeOiledWood, makeStoneBase, makeSteel } from "./materials";

/** Static structural frame: stone floor, plinths, A-frame columns for the
 *  beam fulcrum, bearing pedestals for the crankshaft, boiler platform. */
export function Frame() {
  return (
    <group>
      {/* Stone floor */}
      <mesh receiveShadow rotation={[0, 0, 0]} position={[0, -0.02, 0]}>
        <boxGeometry args={[16, 0.04, 8]} />
        <primitive object={makeStoneBase()} attach="material" />
      </mesh>

      {/* Floor plank lines (subtle wood inlay strip near mechanism) */}
      <mesh position={[0, 0.012, 0]}>
        <boxGeometry args={[10, 0.012, 4.5]} />
        <primitive object={makeOiledWood()} attach="material" />
      </mesh>

      {/* Central plinth under fulcrum A-frame */}
      <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.5, 2.2]} />
        <primitive object={makeStoneBase()} attach="material" />
      </mesh>

      {/* A-frame columns supporting the beam fulcrum (two pairs, splayed) */}
      <AFrameColumn x={0} z={0.95} tilt={-0.12} />
      <AFrameColumn x={0} z={-0.95} tilt={0.12} />
      <AFrameColumn x={0.0} z={0.55} tilt={0.06} mirror />
      <AFrameColumn x={0.0} z={-0.55} tilt={-0.06} mirror />

      {/* Flywheel / crankshaft bearing pedestal */}
      <mesh position={[4.6, 0.55, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.4, 1.1, 2.2]} />
        <primitive object={makeCastIron()} attach="material" />
      </mesh>
      {/* Pedestal cap */}
      <mesh position={[4.6, 1.15, 0]} castShadow>
        <boxGeometry args={[1.5, 0.18, 2.3]} />
        <primitive object={makeCastIron()} attach="material" />
      </mesh>
      {/* Bearing bolts */}
      {[-0.55, 0.55].map((bx) =>
        [-1.0, 1.0].map((bz) => (
          <mesh
            key={`bb-${bx}-${bz}`}
            position={[4.6 + bx, 1.26, bz]}
            castShadow
          >
            <cylinderGeometry args={[0.05, 0.05, 0.12, 8]} />
            <primitive object={makeSteel()} attach="material" />
          </mesh>
        )),
      )}

      {/* Cylinder base plinth */}
      <mesh position={[-2.4, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.7, 0.6, 1.7]} />
        <primitive object={makeStoneBase()} attach="material" />
      </mesh>

      {/* Boiler platform */}
      <mesh position={[-5.6, 0.25, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.0, 0.5, 3.0]} />
        <primitive object={makeStoneBase()} attach="material" />
      </mesh>
      {/* Boiler brick firebox base */}
      <mesh position={[-5.6, 0.65, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.6, 0.5, 2.2]} />
        <meshStandardMaterial color="#7a4a2e" roughness={0.95} metalness={0.05} />
      </mesh>

      {/* Decorative name plate on the central plinth */}
      <mesh position={[0, 0.32, 1.11]} rotation={[0, 0, 0]}>
        <boxGeometry args={[1.2, 0.22, 0.02]} />
        <meshStandardMaterial color="#c9922a" metalness={1} roughness={0.3} />
      </mesh>

      {/* Workshop building environment */}
      <WorkshopBuilding />
    </group>
  );
}

function AFrameColumn({
  x,
  z,
  tilt,
  mirror = false,
}: {
  x: number;
  z: number;
  tilt: number;
  mirror?: boolean;
}) {
  // A column ~4.0 tall, leaning slightly (tilt around X axis by `tilt` rad)
  const h = 4.0;
  return (
    <group position={[x, 0.5, z]} rotation={[tilt, 0, 0]}>
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.28, h, 0.28]} />
        <primitive object={makeCastIron()} attach="material" />
      </mesh>
      {/* Decorative capital */}
      <mesh position={[0, h, 0]} castShadow>
        <boxGeometry args={[0.4, 0.16, 0.4]} />
        <primitive object={makeCastIron()} attach="material" />
      </mesh>
      {/* Base foot */}
      <mesh position={[0, 0.04, 0]} castShadow>
        <boxGeometry args={[0.42, 0.18, 0.42]} />
        <primitive object={makeCastIron()} attach="material" />
      </mesh>
      {mirror && null}
    </group>
  );
}

/** A simple iron rod with end clevises (ball ends) used decoratively. */
export function IronStrut({
  from,
  to,
  thickness = 0.08,
  material,
}: {
  from: [number, number, number];
  to: [number, number, number];
  thickness?: number;
  material?: THREE.Material;
}) {
  const a = new THREE.Vector3(...from);
  const b = new THREE.Vector3(...to);
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const len = a.distanceTo(b);
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    b.clone().sub(a).normalize(),
  );
  return (
    <group position={mid.toArray()} quaternion={quat}>
      <mesh castShadow>
        <cylinderGeometry args={[thickness, thickness, len, 12]} />
        <primitive object={material ?? makeSteel()} attach="material" />
      </mesh>
    </group>
  );
}

/** Workshop building: brick back wall with windows, exposed roof beams,
 *  side wall fragments, cobblestone floor extension, and ambient props
 *  (barrel, workbench, tool rack, coal pile). Enriches the scene without
 *  occluding the engine from any view preset. */
function WorkshopBuilding() {
  return (
    <group>
      {/* ---- Back wall (brick) ---- */}
      <mesh position={[0, 3.5, -4.0]} receiveShadow>
        <boxGeometry args={[20, 7, 0.3]} />
        <meshStandardMaterial color="#3a2e26" roughness={0.95} metalness={0.02} />
      </mesh>
      {/* Brick coursing lines (horizontal grooves) */}
      {[1.5, 2.5, 3.5, 4.5, 5.5].map((y) => (
        <mesh key={`groove-${y}`} position={[0, y, -3.84]}>
          <boxGeometry args={[20, 0.04, 0.02]} />
          <meshStandardMaterial color="#2a2018" roughness={1} />
        </mesh>
      ))}

      {/* ---- Windows on back wall (4 arched openings, glowing at night) ---- */}
      {[-6, -2, 2, 6].map((x) => (
        <group key={`win-${x}`} position={[x, 4.2, -3.83]}>
          {/* Window frame */}
          <mesh>
            <boxGeometry args={[1.8, 2.4, 0.06]} />
            <meshStandardMaterial color="#1a1410" roughness={0.8} />
          </mesh>
          {/* Glazing — emissive so it glows at dusk/night */}
          <mesh position={[0, 0, 0.04]}>
            <planeGeometry args={[1.6, 2.2]} />
            <meshStandardMaterial
              color="#3a4a5a"
              emissive="#6a7a8a"
              emissiveIntensity={0.15}
              roughness={0.2}
              metalness={0.1}
              transparent
              opacity={0.7}
            />
          </mesh>
          {/* Window cross bars */}
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[1.6, 0.04, 0.02]} />
            <meshStandardMaterial color="#1a1410" roughness={0.8} />
          </mesh>
          <mesh position={[0, 0, 0.06]}>
            <boxGeometry args={[0.04, 2.2, 0.02]} />
            <meshStandardMaterial color="#1a1410" roughness={0.8} />
          </mesh>
        </group>
      ))}

      {/* ---- Roof beam structure (exposed timbers, no full ceiling) ---- */}
      {[-7, -3.5, 0, 3.5, 7].map((x) => (
        <mesh key={`beam-${x}`} position={[x, 7.2, -1.5]} castShadow>
          <boxGeometry args={[0.3, 0.3, 6]} />
          <meshStandardMaterial color="#4a3220" roughness={0.9} metalness={0.05} />
        </mesh>
      ))}
      {/* Ridge beam */}
      <mesh position={[0, 7.5, -1.5]} rotation={[0, 0, 0]} castShadow>
        <boxGeometry args={[16, 0.25, 0.25]} />
        <meshStandardMaterial color="#4a3220" roughness={0.9} metalness={0.05} />
      </mesh>
      {/* Roof slope (back half only, so it doesn't block top-down view) */}
      <mesh position={[0, 7.0, -3.0]} rotation={[-0.35, 0, 0]} receiveShadow>
        <boxGeometry args={[16, 0.1, 4]} />
        <meshStandardMaterial color="#2a1f14" roughness={0.95} metalness={0.02} />
      </mesh>

      {/* ---- Side wall fragments (low, don't block camera) ---- */}
      {/* Left wall */}
      <mesh position={[-9, 2, 0]} receiveShadow>
        <boxGeometry args={[0.3, 4, 8]} />
        <meshStandardMaterial color="#332820" roughness={0.95} metalness={0.02} />
      </mesh>
      {/* Right wall */}
      <mesh position={[9, 2, 0]} receiveShadow>
        <boxGeometry args={[0.3, 4, 8]} />
        <meshStandardMaterial color="#332820" roughness={0.95} metalness={0.02} />
      </mesh>

      {/* ---- Cobblestone floor extension ---- */}
      <mesh position={[0, -0.01, 0]} receiveShadow>
        <boxGeometry args={[18, 0.02, 10]} />
        <meshStandardMaterial color="#2e2a26" roughness={1} metalness={0} />
      </mesh>

      {/* ---- Ambient workshop props ---- */}
      {/* Coal pile near the boiler */}
      <group position={[-7.5, 0, 2.5]}>
        <mesh castShadow>
          <coneGeometry args={[0.6, 0.4, 8]} />
          <meshStandardMaterial color="#1a1714" roughness={1} metalness={0.1} />
        </mesh>
        <mesh position={[0.3, 0, 0.1]} castShadow>
          <coneGeometry args={[0.4, 0.3, 6]} />
          <meshStandardMaterial color="#151210" roughness={1} metalness={0.1} />
        </mesh>
      </group>

      {/* Wooden barrel */}
      <group position={[7.5, 0.5, 2.8]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.35, 0.3, 1.0, 12]} />
          <meshStandardMaterial color="#5a3a22" roughness={0.8} metalness={0.05} />
        </mesh>
        {/* Barrel bands */}
        {[0.3, -0.1, -0.4].map((y) => (
          <mesh key={`band-${y}`} position={[0, y, 0]}>
            <torusGeometry args={[0.34, 0.02, 6, 16]} />
            <meshStandardMaterial color="#3a3a3a" metalness={0.8} roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Workbench against the right wall */}
      <group position={[8, 0, -1.5]}>
        <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.08, 2.5]} />
          <meshStandardMaterial color="#5a3a22" roughness={0.7} metalness={0.05} />
        </mesh>
        {/* Legs */}
        {[-0.5, 0.5].map((x) =>
          [-1.0, 1.0].map((z) => (
            <mesh key={`leg-${x}-${z}`} position={[x, 0.22, z]} castShadow>
              <boxGeometry args={[0.08, 0.44, 0.08]} />
              <meshStandardMaterial color="#3a2515" roughness={0.8} />
            </mesh>
          )),
        )}
        {/* Tool on bench (small cylinder = oil can) */}
        <mesh position={[0.2, 0.55, 0.3]} castShadow>
          <cylinderGeometry args={[0.08, 0.1, 0.2, 8]} />
          <meshStandardMaterial color="#8a7a5a" metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* Tool rack on the left wall */}
      <group position={[-8.8, 2.5, 1]}>
        {[-0.4, 0, 0.4].map((z) => (
          <mesh key={`tool-${z}`} position={[0.05, 0, z]} rotation={[0, 0, 0.3]} castShadow>
            <boxGeometry args={[0.04, 0.5, 0.04]} />
            <meshStandardMaterial color="#6a5a3a" metalness={0.3} roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Hanging chain from beam (decorative) */}
      <mesh position={[-3.5, 6.5, 0]} castShadow>
        <cylinderGeometry args={[0.015, 0.015, 1.4, 6]} />
        <meshStandardMaterial color="#2a2520" metalness={0.7} roughness={0.5} />
      </mesh>
      {/* Hook at end of chain */}
      <mesh position={[-3.5, 5.75, 0]}>
        <torusGeometry args={[0.06, 0.015, 6, 12, Math.PI]} />
        <meshStandardMaterial color="#3a3530" metalness={0.8} roughness={0.4} />
      </mesh>
    </group>
  );
}

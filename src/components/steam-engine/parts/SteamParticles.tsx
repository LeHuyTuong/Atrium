"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Module-level scratch objects (safe to share — useFrame callbacks run serially).
const DUMMY = new THREE.Object3D();
const COLOR = new THREE.Color();

interface Puff {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
  scale: number;
}

function makePuffs(
  origin: [number, number, number],
  count: number,
  upward: number,
  spread: number,
): Puff[] {
  return Array.from({ length: count }).map(() => ({
    pos: new THREE.Vector3(
      origin[0] + (Math.random() - 0.5) * spread,
      origin[1] + Math.random() * 0.2,
      origin[2] + (Math.random() - 0.5) * spread,
    ),
    vel: new THREE.Vector3(
      (Math.random() - 0.5) * 0.3,
      upward * (0.5 + Math.random() * 0.8),
      (Math.random() - 0.5) * 0.3,
    ),
    life: Math.random() * 3,
    maxLife: 2.5 + Math.random() * 2.5,
    scale: 0.1 + Math.random() * 0.1,
  }));
}

/** GPU-friendly steam puff system. N instanced spheres recycle through a
 *  lifecycle: spawn at origin, drift up & outward, grow, fade. */
export function SteamParticles({
  origin,
  count = 28,
  rate = 1, // emission rate multiplier
  intensity = 1, // size/opacity multiplier
  upward = 0.6,
  spread = 0.4,
  color = "#f5f5f5",
}: {
  origin: [number, number, number];
  count?: number;
  rate?: number;
  intensity?: number;
  upward?: number;
  spread?: number;
  color?: string;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const puffsRef = useRef<Puff[]>(makePuffs(origin, count, upward, spread));

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const mesh = meshRef.current;
    if (!mesh) return;
    const puffs = puffsRef.current;
    for (let i = 0; i < count; i++) {
      const p = puffs[i];
      p.life += dt * rate;
      if (p.life > p.maxLife) {
        // respawn
        p.pos.set(
          origin[0] + (Math.random() - 0.5) * spread * 0.5,
          origin[1],
          origin[2] + (Math.random() - 0.5) * spread * 0.5,
        );
        p.vel.set(
          (Math.random() - 0.5) * 0.3,
          upward * (0.5 + Math.random() * 0.8),
          (Math.random() - 0.5) * 0.3,
        );
        p.life = 0;
        p.maxLife = 2.5 + Math.random() * 2.5;
        p.scale = 0.1 + Math.random() * 0.1;
      }
      // drift & buoyancy
      p.pos.addScaledVector(p.vel, dt);
      p.vel.y += dt * 0.15;
      p.vel.multiplyScalar(0.99);

      const lifeT = p.life / p.maxLife;
      const size = (0.12 + lifeT * 0.4) * intensity;
      DUMMY.position.copy(p.pos);
      DUMMY.scale.setScalar(size);
      DUMMY.rotation.set(0, 0, 0);
      DUMMY.updateMatrix();
      mesh.setMatrixAt(i, DUMMY.matrix);
      // fade via instance color
      const fade = Math.sin(lifeT * Math.PI); // 0→1→0
      COLOR.set(color).multiplyScalar(0.5 + 0.5 * fade);
      mesh.setColorAt(i, COLOR);
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
    mesh.computeBoundingSphere();
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.32 * intensity}
        roughness={1}
        metalness={0}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

interface Spark {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  life: number;
  maxLife: number;
}

/** A small spark/ember system for the firebox (extra flair). */
export function EmberSparks({
  origin,
  count = 14,
}: {
  origin: [number, number, number];
  count?: number;
}) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const sparksRef = useRef<Spark[]>(
    Array.from({ length: count }).map(() => ({
      pos: new THREE.Vector3(...origin),
      vel: new THREE.Vector3(
        (Math.random() - 0.5) * 0.6,
        0.6 + Math.random() * 0.8,
        (Math.random() - 0.5) * 0.6,
      ),
      life: Math.random() * 1.5,
      maxLife: 1.0 + Math.random() * 1.5,
    })),
  );

  useFrame((_, dtRaw) => {
    const dt = Math.min(dtRaw, 0.05);
    const mesh = meshRef.current;
    if (!mesh) return;
    const sparks = sparksRef.current;
    for (let i = 0; i < count; i++) {
      const p = sparks[i];
      p.life += dt;
      if (p.life > p.maxLife) {
        p.pos.set(...origin);
        p.vel.set(
          (Math.random() - 0.5) * 0.6,
          0.6 + Math.random() * 0.8,
          (Math.random() - 0.5) * 0.6,
        );
        p.life = 0;
        p.maxLife = 1.0 + Math.random() * 1.5;
      }
      p.pos.addScaledVector(p.vel, dt);
      p.vel.y -= dt * 0.4;
      const t = p.life / p.maxLife;
      DUMMY.position.copy(p.pos);
      DUMMY.scale.setScalar(0.04 * (1 - t));
      DUMMY.updateMatrix();
      mesh.setMatrixAt(i, DUMMY.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshBasicMaterial
        color="#ffb24a"
        transparent
        opacity={0.9}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </instancedMesh>
  );
}

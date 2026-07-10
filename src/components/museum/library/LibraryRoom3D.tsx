"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Environment, Float, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/hooks/museum/use-prefers-reduced-motion";

function KnowledgeCore() {
  const outerRingRef = useRef<THREE.Group>(null);
  const innerRingRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const reduced = usePrefersReducedMotion();

  useFrame((state, delta) => {
    if (!outerRingRef.current || !innerRingRef.current || !coreRef.current) return;
    
    if (!reduced) {
      outerRingRef.current.rotation.x += delta * 0.15;
      outerRingRef.current.rotation.y += delta * 0.2;
      
      innerRingRef.current.rotation.x -= delta * 0.25;
      innerRingRef.current.rotation.z += delta * 0.15;
      
      coreRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group position={[0, 0, -1]}>
      <Float speed={reduced ? 0 : 2} rotationIntensity={reduced ? 0 : 0.5} floatIntensity={reduced ? 0 : 2} floatingRange={[-0.2, 0.2]}>
        
        {/* The Core (Abstract Book / Energy) */}
        <mesh ref={coreRef} castShadow>
          <octahedronGeometry args={[1, 1]} />
          <MeshDistortMaterial 
            color="#ffe6a0" 
            emissive="#e8a33a" 
            emissiveIntensity={1.5}
            roughness={0.2}
            metalness={0.8}
            distort={0.3} 
            speed={reduced ? 0 : 2} 
          />
        </mesh>

        {/* Inner Orbital Ring */}
        <group ref={innerRingRef}>
          <mesh castShadow receiveShadow>
            <torusGeometry args={[1.8, 0.02, 16, 100]} />
            <meshStandardMaterial color="#c29142" metalness={0.9} roughness={0.1} />
          </mesh>
          <mesh position={[1.8, 0, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#ffe6a0" emissive="#ffe6a0" emissiveIntensity={2} />
          </mesh>
        </group>

        {/* Outer Orbital Ring */}
        <group ref={outerRingRef}>
          <mesh castShadow receiveShadow>
            <torusGeometry args={[2.5, 0.015, 16, 100]} />
            <meshStandardMaterial color="#8a6125" metalness={1} roughness={0.2} />
          </mesh>
          <mesh position={[0, 2.5, 0]}>
            <octahedronGeometry args={[0.06, 0]} />
            <meshStandardMaterial color="#ffbd59" emissive="#ffbd59" emissiveIntensity={1} />
          </mesh>
          <mesh position={[0, -2.5, 0]}>
            <octahedronGeometry args={[0.06, 0]} />
            <meshStandardMaterial color="#ffbd59" emissive="#ffbd59" emissiveIntensity={1} />
          </mesh>
        </group>

      </Float>

      {/* Subtle floor reflection/grounding */}
      <mesh position={[0, -3.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a110a" roughness={0.2} metalness={0.8} transparent opacity={0.6} />
      </mesh>
    </group>
  );
}

function DustMotes() {
  const ref = useRef<THREE.Points>(null);
  const count = 300;
  const positions = useRef(new Float32Array(count * 3).map(() => (Math.random() - 0.5) * 15));
  const reduced = usePrefersReducedMotion();
  
  useFrame((_, delta) => {
    if (!ref.current || reduced) return;
    const arr = ref.current.geometry.attributes.position.array as Float32Array;
    for (let i = 0; i < count; i++) {
      arr[i * 3 + 1] += delta * 0.08 * (0.5 + (i % 3) * 0.2);
      arr[i * 3] += Math.sin((arr[i * 3 + 2] + arr[i * 3 + 1]) * 1.5) * delta * 0.02;
      if (arr[i * 3 + 1] > 5) arr[i * 3 + 1] = -5;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;
    ref.current.rotation.y += delta * 0.02;
  });
  
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions.current, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#ffd870" transparent opacity={0.4} sizeAttenuation depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

export function LibraryRoom3D() {
  const reduced = usePrefersReducedMotion();
  
  return (
    <div className="absolute inset-0 bg-[#0a0604]"> {/* Dark moody background */}
      <Canvas shadows dpr={[1, 1.6]} camera={{ position: [0, 0, 6.5], fov: 45 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.1} color="#ffb067" />
          
          <spotLight 
            position={[0, 6, 2]} 
            angle={0.7} 
            penumbra={1} 
            intensity={4} 
            color="#ffd870" 
            castShadow 
            shadow-mapSize={[1024, 1024]} 
          />
          
          <pointLight position={[0, 0, 0]} intensity={1.5} color="#e8a33a" distance={8} />
          
          <pointLight position={[-4, -2, -2]} intensity={0.8} color="#b85c18" distance={10} />
          <pointLight position={[4, 2, -2]} intensity={0.8} color="#b85c18" distance={10} />
          
          <KnowledgeCore />
          <DustMotes />
          {!reduced && <Sparkles count={60} scale={[8, 8, 8]} size={2} speed={0.1} opacity={0.2} color="#ffeaa8" />}
          
          <Environment preset="night" environmentIntensity={0.3} />
          <fog attach="fog" args={["#0a0604", 4, 15]} />
        </Suspense>
      </Canvas>
    </div>
  );
}

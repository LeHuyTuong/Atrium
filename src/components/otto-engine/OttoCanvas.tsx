"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import { OttoEngineModel } from "./OttoEngineModel";
import { useOttoStore } from "./useOttoStore";
import { useEffect, Suspense } from "react";

export default function OttoCanvas() {
  const toggle = useOttoStore((s) => s.toggle);
  const reset = useOttoStore((s) => s.reset);

  useEffect(() => {
    return () => reset(); // Cleanup on unmount
  }, [reset]);

  return (
    <Canvas
      camera={{ position: [5, 2.5, 6], fov: 42, near: 0.1, far: 100 }}
      shadows
      className="h-full w-full outline-none"
    >
      <Suspense fallback={null}>
        <color attach="background" args={["#120e0a"]} />
        
        {/* Cinematic Lighting */}
        <hemisphereLight args={["#ffaa77", "#2a2018", 0.6]} />
        <ambientLight intensity={0.3} />
        
        <directionalLight
          position={[-6, 9, 5]}
          intensity={2.8}
          color="#ffcba4"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0005}
        >
          <orthographicCamera attach="shadow-camera" args={[-8, 8, 8, -8, 0.1, 30]} />
        </directionalLight>
        
        <directionalLight position={[7, 4, 6]} intensity={0.8} color="#90b0d0" />
        <pointLight position={[0, 4, -4]} intensity={1.5} color="#ff8844" distance={15} decay={2} />

        {/* Environment for reflections */}
        <Environment preset="warehouse" environmentIntensity={0.3} />

        {/* Interactive Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minDistance={3}
          maxDistance={12}
          minPolarAngle={0.2}
          maxPolarAngle={Math.PI / 1.7}
          autoRotate
          autoRotateSpeed={0.8}
          target={[0, 0, 0]}
          makeDefault
        />

        <group position={[0, -0.4, 0]}>
          <OttoEngineModel isSimMaster={true} />
        </group>

        {/* Floor shadow */}
        <ContactShadows
          position={[0, -2.0, 0]}
          opacity={0.7}
          scale={15}
          blur={2.5}
          far={4}
          color="#000000"
        />
      </Suspense>
    </Canvas>
  );
}

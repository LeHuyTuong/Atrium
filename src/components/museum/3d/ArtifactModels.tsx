"use client";

import React, { useMemo, useRef, useEffect } from "react";
import { useGLTF, useAnimations, Center } from "@react-three/drei";
import { Motif } from "@/lib/museum-data";

interface ModelProps {
  accent: string;
  spinning?: boolean;
}

interface ModelConfig {
  url: string;
  scale?: number;
  rotation?: [number, number, number];
  position?: [number, number, number];
}

const GLB_CONFIGS: Record<Motif, ModelConfig> = {
  "flying-shuttle": {
    url: "/models/1/flying_shuttle_johnkay.glb",
    scale: 0.8,
  },
  "steam-engine": {
    url: "/models/1/steam-engine_watt.glb",
    scale: 0.65,
    rotation: [0, Math.PI / 2, 0],
  },
  "steamboat-fulton": {
    url: "/models/1/steamboat_fulton.glb",
    scale: 1.2,
  },
  "locomotive": {
    url: "/models/1/stephensons_rocket.glb",
    scale: 0.55,
    rotation: [0, -Math.PI / 4, 0],
  },
  "bessemer-converter": {
    url: "/models/2/bessemer+converter.glb",
    scale: 1.0,
  },
  "dynamo": {
    url: "/models/2/dynamo_Siemens.glb",
    scale: 1.2,
  },
  "motorwagen": {
    url: "/models/2/motorwagen_von_carl_benz.glb",
    scale: 0.55,
    rotation: [0, -Math.PI / 4, 0],
  },
  "wright-flyer": {
    url: "/models/2/1903_wright_flyer.glb",
    scale: 0.45,
  },
  "unimate-robot": {
    url: "/models/3/First+Unimate+Robot.glb",
    scale: 1.3,
  },
  "intel-4004": {
    url: "/models/3/Microprocessor_Intel+4004.glb",
    scale: 1.1,
  },
  "modicon-plc": {
    url: "/models/3/Modicon PLC.glb",
    scale: 0.7,
  },
  "altair-8800": {
    url: "/models/3/altair8800computer.glb",
    scale: 0.75,
  },
  "atlas-robot": {
    url: "/models/4/Robot+_Atlas.glb",
    scale: 1.3,
  },
  "amazon-echo": {
    url: "/models/4/amazon_echo.glb",
    scale: 1.2,
  },
  "iphone-4s": {
    url: "/models/4/iphone_4s.glb",
    scale: 4.5,
    rotation: [Math.PI / 6, Math.PI / 4, 0],
  },
};

// Preload all 3D GLB models to ensure smooth performance in the 3D gallery
Object.values(GLB_CONFIGS).forEach((config) => {
  useGLTF.preload(config.url);
});

function GLBLoader({ motif, spinning }: { motif: Motif; spinning?: boolean }) {
  const group = useRef<any>(null);

  // Safe default url in case motif is not in GLB_CONFIGS
  const config = GLB_CONFIGS[motif] || { url: "/models/1/flying_shuttle_johnkay.glb" };

  // Load the GLB file
  const { scene, animations } = useGLTF(config.url);

  // Clone scene so that Compare modal or concurrent instances don't conflict
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  // Handle animations if available in the GLB file
  const { actions } = useAnimations(animations, group);

  useEffect(() => {
    if (spinning && actions && Object.keys(actions).length > 0) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.reset().fadeIn(0.2).play();
        }
      });
    } else if (!spinning && actions) {
      Object.values(actions).forEach((action) => {
        if (action) {
          action.fadeOut(0.2);
        }
      });
    }
  }, [actions, spinning]);

  if (!GLB_CONFIGS[motif]) {
    return null;
  }

  const scale = config.scale ?? 1;
  const rotation = config.rotation ?? [0, 0, 0];
  const position = config.position ?? [0, 0, 0];

  return (
    <group ref={group} dispose={null}>
      <Center>
        <primitive
          object={clonedScene}
          scale={scale}
          rotation={rotation}
          position={position}
        />
      </Center>
    </group>
  );
}

export function ArtifactModel({ motif, spinning }: { motif: Motif; accent: string; spinning?: boolean }) {
  return <GLBLoader motif={motif} spinning={spinning} />;
}

export function motifHasModel(motif: Motif): boolean {
  return motif in GLB_CONFIGS;
}

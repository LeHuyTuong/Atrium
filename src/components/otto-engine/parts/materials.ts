import * as THREE from "three";

// Shared materials for the Otto engine

export const metalMaterial = new THREE.MeshStandardMaterial({
  color: "#9ca3af",
  metalness: 0.9,
  roughness: 0.3,
});

export const darkMetalMaterial = new THREE.MeshStandardMaterial({
  color: "#4b5563",
  metalness: 0.8,
  roughness: 0.5,
});

export const brassMaterial = new THREE.MeshStandardMaterial({
  color: "#b8893f",
  metalness: 0.8,
  roughness: 0.2,
});

export const castIronMaterial = new THREE.MeshStandardMaterial({
  color: "#2a2d34",
  metalness: 0.6,
  roughness: 0.7,
});

export const ceramicMaterial = new THREE.MeshStandardMaterial({
  color: "#f3f4f6",
  metalness: 0.1,
  roughness: 0.2,
});

export const highlightMaterial = new THREE.MeshStandardMaterial({
  color: "#3b82f6",
  emissive: "#1d4ed8",
  emissiveIntensity: 0.5,
  metalness: 0.5,
  roughness: 0.2,
  transparent: true,
  opacity: 0.9,
});

export const glassMaterial = new THREE.MeshStandardMaterial({
  color: "#e5e7eb",
  metalness: 0.1,
  roughness: 0.1,
  transparent: true,
  opacity: 0.2,
  side: THREE.DoubleSide,
});

// Helper for dynamic material switching
export function getMaterial(
  isHighlighted: boolean,
  baseMaterial: THREE.Material,
  isDimmed: boolean = false
) {
  if (isHighlighted) return highlightMaterial;
  
  // Clone to apply dimming if needed, but for performance, we might just use opacity
  // Note: For simplicity in R3F, we often handle dimming at the group level via opacity if possible.
  // Here we just return base.
  return baseMaterial;
}

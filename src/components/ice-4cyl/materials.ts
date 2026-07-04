"use client";

import * as THREE from "three";

export function makeCastIron() {
  return new THREE.MeshStandardMaterial({
    color: "#3a3d42",
    metalness: 0.85,
    roughness: 0.55,
  });
}

export function makePolishedBrass() {
  return new THREE.MeshStandardMaterial({
    color: "#c9922a",
    metalness: 1,
    roughness: 0.28,
    emissive: "#3a2400",
    emissiveIntensity: 0.15,
  });
}

export function makeAluminum() {
  return new THREE.MeshStandardMaterial({
    color: "#8a9aaa",
    metalness: 0.9,
    roughness: 0.25,
  });
}

export function makeSteel() {
  return new THREE.MeshStandardMaterial({
    color: "#8a9099",
    metalness: 1,
    roughness: 0.3,
  });
}

export function makeBluedSteel() {
  return new THREE.MeshStandardMaterial({
    color: "#566578",
    metalness: 1,
    roughness: 0.25,
  });
}

export function makeCopper() {
  return new THREE.MeshStandardMaterial({
    color: "#b5603a",
    metalness: 0.95,
    roughness: 0.35,
  });
}

export function makeRubber() {
  return new THREE.MeshStandardMaterial({
    color: "#1a1512",
    roughness: 0.95,
    metalness: 0,
  });
}

export function makeCeramic() {
  return new THREE.MeshStandardMaterial({
    color: "#f0ecd6",
    roughness: 0.8,
    metalness: 0,
  });
}

export function makeCastAluminum() {
  return new THREE.MeshStandardMaterial({
    color: "#7a8898",
    metalness: 0.7,
    roughness: 0.45,
  });
}

export function makeHighlight() {
  return new THREE.MeshStandardMaterial({
    color: "#ffb347",
    emissive: "#ff8a00",
    emissiveIntensity: 0.6,
    metalness: 0.6,
    roughness: 0.4,
    transparent: true,
    opacity: 0.9,
  });
}

export function makeGlow(color: string, intensity = 1) {
  return new THREE.MeshStandardMaterial({
    color,
    emissive: color,
    emissiveIntensity: intensity,
    metalness: 0,
    roughness: 1,
  });
}

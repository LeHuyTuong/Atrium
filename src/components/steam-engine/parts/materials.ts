"use client";

import * as THREE from "three";

/** Reusable PBR-ish materials for the beam engine. Warm industrial palette:
 *  cast iron, polished brass, copper, blued steel, oiled wood, fire, steam. */

export function makeCastIron() {
  return new THREE.MeshStandardMaterial({
    color: "#c29b46",
    metalness: 0.9,
    roughness: 0.4,
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

export function makeDullBrass() {
  return new THREE.MeshStandardMaterial({
    color: "#a87822",
    metalness: 0.9,
    roughness: 0.45,
  });
}

export function makeCopper() {
  return new THREE.MeshStandardMaterial({
    color: "#b5603a",
    metalness: 0.95,
    roughness: 0.35,
  });
}

export function makeBluedSteel() {
  return new THREE.MeshStandardMaterial({
    color: "#e6c373",
    metalness: 1,
    roughness: 0.25,
  });
}

export function makeSteel() {
  return new THREE.MeshStandardMaterial({
    color: "#d9b662",
    metalness: 1,
    roughness: 0.3,
  });
}

export function makeOiledWood() {
  return new THREE.MeshStandardMaterial({
    color: "#5a3a22",
    metalness: 0.05,
    roughness: 0.7,
  });
}

export function makeStoneBase() {
  return new THREE.MeshStandardMaterial({
    color: "#6b6660",
    metalness: 0.05,
    roughness: 0.95,
  });
}

export function makeFire() {
  return new THREE.MeshBasicMaterial({
    color: "#ff7a1a",
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
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

export function makeSteam() {
  return new THREE.MeshStandardMaterial({
    color: "#f4f4f4",
    transparent: true,
    opacity: 0.42,
    roughness: 1,
    metalness: 0,
    depthWrite: false,
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

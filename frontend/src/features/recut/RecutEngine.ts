import * as THREE from 'three';

export interface RecutResult {
  part1: THREE.Group;
  part2: THREE.Group;
  hasValidCut: boolean;
}

export function performRecut(
  originalMesh: THREE.Mesh,
  angle: number,
  offset: number
): RecutResult {
  const part1 = new THREE.Group();
  const part2 = new THREE.Group();

  try {
    const mesh1 = originalMesh.clone();
    const mesh2 = originalMesh.clone();

    // Apply different materials to distinguish parts
    const material1 = new THREE.MeshStandardMaterial({
      color: 0xff9933,
      metalness: 0.3,
      roughness: 0.6
    });
    const material2 = new THREE.MeshStandardMaterial({
      color: 0x33cccc,
      metalness: 0.3,
      roughness: 0.6
    });

    if (mesh1 instanceof THREE.Mesh) mesh1.material = material1;
    if (mesh2 instanceof THREE.Mesh) mesh2.material = material2;

    // Position parts based on offset
    const angleRad = (angle * Math.PI) / 180;
    const separationDistance = 0.5;

    mesh1.position.x = Math.cos(angleRad) * (offset - separationDistance);
    mesh1.position.z = Math.sin(angleRad) * (offset - separationDistance);

    mesh2.position.x = Math.cos(angleRad) * (offset + separationDistance);
    mesh2.position.z = Math.sin(angleRad) * (offset + separationDistance);

    part1.add(mesh1);
    part2.add(mesh2);

    return { part1, part2, hasValidCut: true };
  } catch (error) {
    console.error('Recut failed:', error);
    return { part1, part2, hasValidCut: false };
  }
}

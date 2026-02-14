import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export interface LoadedModel {
  scene: THREE.Group;
  originalMesh: THREE.Mesh | null;
}

export async function loadModelFromFile(file: File): Promise<LoadedModel> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (!extension) {
    throw new Error('Unable to determine file type');
  }

  if (extension === 'glb' || extension === 'gltf') {
    return loadGLTF(file);
  } else if (extension === 'obj') {
    return loadOBJ(file);
  } else {
    throw new Error(
      `Unsupported file format: .${extension}. Please use GLB, GLTF, or OBJ files.`
    );
  }
}

async function loadGLTF(file: File): Promise<LoadedModel> {
  const loader = new GLTFLoader();
  const arrayBuffer = await file.arrayBuffer();
  const blob = new Blob([arrayBuffer]);
  const url = URL.createObjectURL(blob);

  try {
    const gltf = await loader.loadAsync(url);
    URL.revokeObjectURL(url);

    const scene = gltf.scene;
    let originalMesh: THREE.Mesh | null = null;

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh && !originalMesh) {
        originalMesh = child;
      }
    });

    return { scene, originalMesh };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw new Error(`Failed to load GLTF model: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function loadOBJ(file: File): Promise<LoadedModel> {
  const loader = new OBJLoader();
  const text = await file.text();

  try {
    const object = loader.parse(text);
    let originalMesh: THREE.Mesh | null = null;

    object.traverse((child) => {
      if (child instanceof THREE.Mesh && !originalMesh) {
        originalMesh = child;
        if (!child.material) {
          child.material = new THREE.MeshStandardMaterial({ color: 0x888888 });
        }
      }
    });

    return { scene: object, originalMesh };
  } catch (error) {
    throw new Error(`Failed to load OBJ model: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

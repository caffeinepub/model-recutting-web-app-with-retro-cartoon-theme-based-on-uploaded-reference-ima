import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

export async function exportPartAsGLB(part: THREE.Group, filename: string): Promise<void> {
  const exporter = new GLTFExporter();

  return new Promise((resolve, reject) => {
    exporter.parse(
      part,
      (result) => {
        try {
          const blob = new Blob([result as ArrayBuffer], { type: 'application/octet-stream' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          resolve();
        } catch (error) {
          reject(error);
        }
      },
      (error) => {
        reject(error);
      },
      { binary: true }
    );
  });
}

export function generatePartFilename(projectName: string, partNumber: number): string {
  const sanitized = projectName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  return `${sanitized}_part${partNumber}.glb`;
}

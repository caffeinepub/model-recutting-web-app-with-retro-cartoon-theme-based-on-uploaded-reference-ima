import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { RecutResult } from './RecutEngine';
import type { PartVisibility } from './recutTypes';

interface RecutPreviewProps {
  recutResult: RecutResult | null;
  visibility: PartVisibility;
  showReferenceModel: boolean;
  showSectionHelper: boolean;
  referenceModel: THREE.Group | null;
  className?: string;
}

export default function RecutPreview({
  recutResult,
  visibility,
  showReferenceModel,
  showSectionHelper,
  referenceModel,
  className = ''
}: RecutPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a2e);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(5, 5, 5);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 10, 5);
    scene.add(directionalLight1);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-5, 5, -5);
    scene.add(directionalLight2);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
    scene.add(gridHelper);

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      controls.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;

    scene.children
      .filter((child) => child.userData.isRecutPart || child.userData.isReference || child.userData.isHelper)
      .forEach((child) => scene.remove(child));

    if (showReferenceModel && referenceModel) {
      const refClone = referenceModel.clone();
      refClone.userData.isReference = true;
      refClone.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.material = new THREE.MeshStandardMaterial({
            color: 0x666666,
            transparent: true,
            opacity: 0.3,
            wireframe: true
          });
        }
      });
      scene.add(refClone);
    }

    if (recutResult && recutResult.hasValidCut) {
      if (visibility.part1) {
        recutResult.part1.userData.isRecutPart = true;
        scene.add(recutResult.part1);
      }
      if (visibility.part2) {
        recutResult.part2.userData.isRecutPart = true;
        scene.add(recutResult.part2);
      }
    }

    if (showSectionHelper) {
      const planeGeometry = new THREE.PlaneGeometry(5, 5);
      const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0xffff00,
        transparent: true,
        opacity: 0.2,
        side: THREE.DoubleSide
      });
      const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
      planeMesh.userData.isHelper = true;
      scene.add(planeMesh);
    }
  }, [recutResult, visibility, showReferenceModel, showSectionHelper, referenceModel]);

  return <div ref={containerRef} className={`viewport-container ${className}`} />;
}

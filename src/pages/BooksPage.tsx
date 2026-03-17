import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls } from "@react-three/drei";
import { useEffect } from "react";
import { useTexture } from "@react-three/drei";
import * as THREE from "three";

function BookModel() {
  const { scene } = useGLTF("/book1.glb");
  const coverTexture = useTexture("/monk_and_robot.jpg"); // put your image in /public

  useEffect(() => {
    coverTexture.wrapS = THREE.ClampToEdgeWrapping;
    coverTexture.wrapT = THREE.ClampToEdgeWrapping;
    coverTexture.needsUpdate = true;
    scene.traverse((child) => {
      if (child.isMesh && child.name === "cover") {
        child.material = child.material.clone();
        child.material.map = coverTexture;
        child.material.needsUpdate = true;
      }
      if (child.isMesh && child.name === "Cube") {
        child.material = child.material.clone();
        child.material.color.set("#444e36");
        child.material.roughness = 0.4;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      }
      if (child.isMesh && child.name === "Cube002") {
        child.material = child.material.clone();
        child.material.color.set("#fffce5");
        child.material.roughness = 0.8;
        child.material.metalness = 0.0;
        child.material.needsUpdate = true;
      }
    });
  }, [scene, coverTexture]);
  const offset = 0;
  return (
    <primitive
      object={scene}
      scale={2}
      rotation={[0, -Math.PI / 2 - offset, 0]}
    />
  );
}

export function BooksPage() {
  return (
    <div className="container font-light">
      <div className="flex items-center">
        <p className="font-semibold">Books read in</p>
        <div className="mx-4">
          <span className="text-sm">2026</span>
        </div>
      </div>
      <div className="w-full h-96">
        <Canvas
          camera={{
            position: [5, 0, 0],
            fov: 75,
          }}
        >
          <ambientLight intensity={2} />
          <directionalLight position={[10, 10, 5]} intensity={4} />
          <BookModel />
          <OrbitControls
            target={[0, 0, 0]}
            enableZoom={false}
            minPolarAngle={Math.PI / 2}
            maxPolarAngle={Math.PI / 2}
            minAzimuthAngle={-Math.PI / 8}
            maxAzimuthAngle={Math.PI / 8}
          />
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload("/book1.glb");

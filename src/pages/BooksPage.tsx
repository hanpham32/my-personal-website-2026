import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, useTexture } from "@react-three/drei";
import { useEffect, Suspense } from "react";
import * as THREE from "three";
import bookData from "../../book_covers_manifest.json";

interface Book {
  title: string;
  author: string;
  filename: string | null;
  status: string;
  "mesh-cover"?: string;
}

function BookModel({
  coverImage,
  meshCover,
}: {
  coverImage: string;
  meshCover: string;
}) {
  const { scene: originalScene } = useGLTF("/book2.glb");
  const coverTexture = useTexture(coverImage);

  const scene = originalScene.clone(true);

  useEffect(() => {
    coverTexture.wrapS = THREE.ClampToEdgeWrapping;
    coverTexture.wrapT = THREE.ClampToEdgeWrapping;
    coverTexture.needsUpdate = true;
    scene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.name === "cover") {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mesh.material = mat.clone();
        (mesh.material as THREE.MeshStandardMaterial).map = coverTexture;
        mesh.material.needsUpdate = true;
      }
      if (mesh.isMesh && mesh.name === "Cube") {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mesh.material = mat.clone();
        (mesh.material as THREE.MeshStandardMaterial).color.set(meshCover);
        (mesh.material as THREE.MeshStandardMaterial).roughness = 0.4;
        (mesh.material as THREE.MeshStandardMaterial).metalness = 0.0;
        mesh.material.needsUpdate = true;
      }
      if (mesh.isMesh && mesh.name === "Cube002") {
        const mat = mesh.material as THREE.MeshStandardMaterial;
        mesh.material = mat.clone();
        (mesh.material as THREE.MeshStandardMaterial).color.set(meshCover);
        (mesh.material as THREE.MeshStandardMaterial).roughness = 0.8;
        (mesh.material as THREE.MeshStandardMaterial).metalness = 0.0;
        mesh.material.needsUpdate = true;
      }
    });
  }, [scene, coverTexture, meshCover]);

  return <primitive object={scene} scale={2} rotation={[0, -Math.PI / 2, 0]} />;
}

export function BooksPage() {
  return (
    <div className="container font-light">
      {(Object.keys(bookData) as string[])
        .filter((year) => year === "2026")
        .sort((a, b) => Number(b) - Number(a))
        .map((year) => {
          const books = (bookData[year] as Book[]).filter(
            (book) => book.status === "success" && book.filename,
          );
          return (
            <div key={year} className="mb-8">
              <div className="flex items-center mb-4">
                <p className="font-semibold">Books read in</p>
                <div className="mx-4">
                  <span className="text-sm">{year}</span>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {books.map((book) => (
                  <div key={book.filename} className="h-64">
                    <Canvas
                      camera={{
                        position: [5, 0, 0],
                        fov: 75,
                      }}
                    >
                      <ambientLight intensity={0.5} />
                      <directionalLight position={[10, 10, 5]} intensity={4} />
                      <Suspense fallback={null}>
                        <BookModel
                          coverImage={`/book_covers/${year}/${book.filename}`}
                          meshCover={book["mesh-cover"] || "#fffce5"}
                        />
                      </Suspense>
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
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}

useGLTF.preload("/book2.glb");

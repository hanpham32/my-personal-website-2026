import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, useTexture } from "@react-three/drei";
import { useState, useEffect, Suspense, useRef } from "react";
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
  isHovered,
}: {
  coverImage: string;
  meshCover: string;
  isHovered: boolean;
}) {
  const { scene: originalScene } = useGLTF("/book2.glb");
  const scene = originalScene.clone(true);
  const coverTexture = useTexture(coverImage);
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const target = isHovered ? Math.PI / 8 : 0;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      target,
      0.1,
    );
  });

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
  return (
    <group ref={groupRef}>
      <primitive object={scene} scale={2} rotation={[0, -Math.PI / 8, 0]} />
    </group>
  );
}

function BookCard({ book, year }: { book: Book; year: string }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="h-36 w-36 rounded-xl overflow-hidden"
        style={{ backgroundColor: "var(--surface)" }}
      >
        <Canvas
          className="h-full w-full"
          camera={{ position: [3.7, 0, 0], fov: 75 }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={4} />
          <Suspense fallback={null}>
            <BookModel
              coverImage={`/book_covers/${year}/${book.filename}`}
              meshCover={book["mesh-cover"] || "#fffce5"}
              isHovered={isHovered}
            />
          </Suspense>
          <OrbitControls
            target={[0, 0, 0]}
            enableZoom={false}
            enableRotate={false}
          />
        </Canvas>
      </div>
      <div className="mt-2 text-center">
        <p className="text-sm font-medium">{book.title}</p>
        <p className="text-xs opacity-70">{book.author}</p>
      </div>
    </div>
  );
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
                {books.map((book) => (
                  <BookCard key={book.filename} book={book} year={year} />
                ))}
              </div>
            </div>
          );
        })}
    </div>
  );
}

useGLTF.preload("/book2.glb");

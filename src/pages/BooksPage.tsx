import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, OrbitControls, useTexture } from "@react-three/drei";
import { useState, useEffect, Suspense, useRef } from "react";
import * as THREE from "three";

interface Book {
  title: string;
  author: string;
  imageUrl: string;
  imageColor: string;
  status: "read" | "reading";
}

interface BooksByYear {
  [year: string]: Book[];
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

function BookCard({ book }: { book: Book }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex flex-col items-center">
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="h-36 w-36 rounded overflow-hidden"
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
              coverImage={book.imageUrl}
              meshCover={book.imageColor || "#fffce5"}
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
        {book.status === "reading" && (
          <span
            className="text-[10px] px-1.5 py-0.5 rounded-full mr-1"
            style={{ backgroundColor: "var(--accent-bg)", color: "white" }}
          >
            reading
          </span>
        )}
        <span className="text-sm font-medium">{book.title}</span>
        <br />
        <span className="text-xs opacity-70">{book.author}</span>
      </div>
    </div>
  );
}

export function BooksPage() {
  const [booksByYear, setBooksByYear] = useState<BooksByYear>({});
  const [selectedYear, setSelectedYear] = useState<string>("2026");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/book-logs")
      .then((res) => res.json())
      .then((data) => {
        const booksData = data?.data?.me?.[0]?.lists || [];
        const currentlyReadingData = data?.data?.me?.[0]?.user_books || [];
        const transformed: BooksByYear = {};

        booksData.forEach(
          (list: {
            name: string;
            list_books: {
              book: {
                title: string;
                image: { url: string; color: string };
                contributions: { author: { name: string } }[];
              };
            }[];
          }) => {
            const year = list.name;
            transformed[year] = list.list_books.map((lb) => ({
              title: lb.book.title,
              author: lb.book.contributions[0]?.author?.name || "Unknown",
              imageUrl: `/api/image-proxy?url=${encodeURIComponent(lb.book.image.url)}`,
              imageColor: lb.book.image.color,
              status: "read" as const,
            }));
          },
        );

        const currentYear = "2026";
        if (!transformed[currentYear]) {
          transformed[currentYear] = [];
        }

        currentlyReadingData.forEach(
          (item: {
            book: {
              title: string;
              image: { url: string; color: string };
              contributions: { author: { name: string } }[];
            };
          }) => {
            transformed[currentYear].push({
              title: item.book.title,
              author: item.book.contributions[0]?.author?.name || "Unknown",
              imageUrl: `/api/image-proxy?url=${encodeURIComponent(item.book.image.url)}`,
              imageColor: item.book.image.color,
              status: "reading" as const,
            });
          },
        );

        setBooksByYear(transformed);
        const years = Object.keys(transformed).sort(
          (a, b) => Number(b) - Number(a),
        );
        if (years.length > 0) {
          setSelectedYear(years[0]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch books:", err);
        setLoading(false);
      });
  }, []);

  const years = Object.keys(booksByYear).sort((a, b) => Number(b) - Number(a));
  const books = booksByYear[selectedYear] || [];

  if (loading) {
    return (
      <div className="container font-light">
        <p>Loading books...</p>
      </div>
    );
  }

  return (
    <div className="container font-light">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-sm font-semibold opacity-70 mr-2">
            Books by year:
          </span>
          {years.map((year) => (
            <button
              key={year}
              onClick={() => setSelectedYear(year)}
              className={`relative cursor-pointer px-4 py-1.5 text-sm transition-all duration-200 rounded flex items-center gap-1.5 ${
                selectedYear === year
                  ? "bg-surface text-text-h opacity-100"
                  : "bg-transparent text-text opacity-70"
              }`}
            >
              {year}
              <span className="text-[10px] px-1.5 py-0.5 opacity-60">
                {booksByYear[year]?.length}
              </span>
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 justify-items-center">
          {books.map((book, idx) => (
            <BookCard key={`${book.title}-${idx}`} book={book} />
          ))}
        </div>
      </div>
      <div className="flex justify-end">
        <span className="text-xs mx-1 opacity-70">
          API powered by
          <a
            className="ml-1 hover:underline"
            href="https://hardcover.app/"
            target="_blank"
          >
            Hardcover
          </a>
        </span>
        <img src="/hardcover_logo.png" width={12} />
      </div>
    </div>
  );
}

useGLTF.preload("/book2.glb");

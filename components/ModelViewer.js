import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment } from "@react-three/drei";
import { Suspense } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";

function Model({ filePath }) {
  const gltf = useLoader(GLTFLoader, filePath);
  return <primitive object={gltf.scene} scale={1.5} />;
}

export default function ModelViewer({ filePath }) {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
      <Suspense fallback={null}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Model filePath={filePath} />
        <Environment preset="sunset" />
        <OrbitControls />
      </Suspense>
    </Canvas>
  );
}

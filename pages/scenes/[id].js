import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const SceneEditor = dynamic(() => import("@/components/SceneEditor"), { ssr: false });

export default function ScenePage() {
  const router = useRouter();
  const { id } = router.query;
  const [scene, setScene] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/scenes/${id}`)
        .then((res) => res.json())
        .then(setScene);
    }
  }, [id]);

  if (!scene) return <p>Loading scene...</p>;

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <SceneEditor scene={scene} />
    </div>
  );
}

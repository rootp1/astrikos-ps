import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const ModelViewer = dynamic(() => import("../../components/ModelViewer"), {
    ssr: false,
  });
  

export default function ModelViewPage() {
  const router = useRouter();
  const { id } = router.query;

  const [asset, setAsset] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/model3d/${id}`)
        .then((res) => res.json())
        .then(setAsset);
    }
  }, [id]);

  if (!asset) return <p>Loading model...</p>;

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <ModelViewer filePath={asset.filePath} />
    </div>
  );
}

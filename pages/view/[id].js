import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function ViewSVG() {
  const router = useRouter();
  const { id } = router.query;

  const [asset, setAsset] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/vector2d/${id}`)
        .then(res => res.json())
        .then(setAsset);
    }
  }, [id]);

  if (!asset) return <p>Loading...</p>;

  return (
    <div style={{ padding: 20 }}>
      <h2>{asset.name}</h2>
      <iframe
        src={asset.filePath}
        style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}
      />
    </div>
  );
}

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";

const MapViewer = dynamic(() => import("@/components/MapViewer"), { ssr: false });

export default function MapPage() {
  const router = useRouter();
  const { id } = router.query;

  const [mapData, setMapData] = useState(null);

  useEffect(() => {
    if (id) {
      fetch(`/api/maps/${id}`)
        .then((res) => res.json())
        .then(setMapData);
    }
  }, [id]);

  if (!mapData) return <p>Loading...</p>;

  return (
    <div style={{ height: "100vh", width: "100vw" }}>
      <MapViewer filePath={mapData.filePath} />
    </div>
  );
}

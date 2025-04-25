import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, FeatureGroup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { Viewer, GeoJsonDataSource, Ion, Color, createWorldTerrainAsync } from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import L from 'leaflet';
import 'leaflet-draw';

Ion.defaultAccessToken = process.env.NEXT_PUBLIC_CESIUM_TOKEN;

const MapViewer = ({ mapId }) => {
  const [mapData, setMapData] = useState(null);
  const [viewMode, setViewMode] = useState('2d');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  const featureGroupRef = useRef(null);
  const cesiumContainerRef = useRef(null);
  const cesiumViewerRef = useRef(null);

  // Fetch map data
  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch(`/api/maps/${mapId}`);
        if (!res.ok) throw new Error('Failed to fetch map data');
        const data = await res.json();

        // Debug logging:
        console.log('Fetched map data:', data);

        setMapData(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (mapId) fetchMapData();
  }, [mapId]);

  // Initialize Cesium when switching to 3D
  useEffect(() => {
    const initCesium = async () => {
      if (viewMode !== '3d' || !mapData || cesiumViewerRef.current) return;

      try {
        if (!mapData.geojsonData || typeof mapData.geojsonData !== 'object') {
          throw new Error('GeoJSON data is missing or invalid');
        }

        const terrainProvider = await createWorldTerrainAsync();

        const viewer = new Viewer(cesiumContainerRef.current, {
          terrainProvider,
          infoBox: false,
          selectionIndicator: false,
          navigationHelpButton: false,
          baseLayerPicker: false,
        });

        cesiumViewerRef.current = viewer;

        const geojson = mapData.geojsonData;

        const dataSource = await GeoJsonDataSource.load(geojson, {
          stroke: Color.BLUE,
          fill: Color.CYAN.withAlpha(0.5),
          strokeWidth: 3,
          clampToGround: true,
        });

        viewer.dataSources.add(dataSource);
        viewer.zoomTo(dataSource);
      } catch (e) {
        console.error('Cesium init error:', e);
        setError(`Cesium init failed: ${e.message}`);
      }
    };

    initCesium();

    return () => {
      if (cesiumViewerRef.current) {
        cesiumViewerRef.current.destroy();
        cesiumViewerRef.current = null;
      }
    };
  }, [viewMode, mapData]);

  const saveChanges = async () => {
    if (!featureGroupRef.current) return;
    try {
      setIsSaving(true);
      const updatedGeo = featureGroupRef.current.toGeoJSON();
      const res = await fetch(`/api/maps/${mapId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ geojsonData: updatedGeo }),
      });
      if (!res.ok) throw new Error('Failed to save map');
      const updated = await res.json();
      setMapData(updated);
      alert('Map saved!');
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const MapDrawControl = () => {
    const map = useMap();

    useEffect(() => {
      if (!map || !mapData) return;

      const drawnItems = new L.FeatureGroup();
      map.addLayer(drawnItems);

      if (mapData.geojsonData) {
        try {
          const geoLayer = L.geoJSON(mapData.geojsonData);
          geoLayer.eachLayer((layer) => drawnItems.addLayer(layer));
          map.fitBounds(geoLayer.getBounds());
        } catch (err) {
          console.error('Invalid GeoJSON in Leaflet:', err);
        }
      }

      const drawControl = new L.Control.Draw({
        draw: {
          polygon: true,
          polyline: true,
          rectangle: true,
          marker: true,
          circle: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: drawnItems,
        },
      });

      map.addControl(drawControl);
      map.on('draw:created', (e) => drawnItems.addLayer(e.layer));
      featureGroupRef.current = drawnItems;

      return () => {
        map.removeControl(drawControl);
        map.removeLayer(drawnItems);
      };
    }, [map, mapData]);

    return null;
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
  if (!mapData) return <div>No map data</div>;

  return (
    <div>
      <div style={{ marginBottom: 10 }}>
        <button onClick={() => setViewMode('2d')} disabled={viewMode === '2d'}>2D View</button>
        <button onClick={() => setViewMode('3d')} disabled={viewMode === '3d'}>3D View</button>
        {viewMode === '2d' && (
          <button onClick={saveChanges} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        )}
      </div>

      {viewMode === '2d' ? (
        <MapContainer style={{ height: '600px', width: '100%' }} center={[0, 0]} zoom={2}>
          <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
          <MapDrawControl />
        </MapContainer>
      ) : (
        <div ref={cesiumContainerRef} style={{ height: '600px', width: '100%' }} />
      )}
    </div>
  );
};

export default MapViewer;
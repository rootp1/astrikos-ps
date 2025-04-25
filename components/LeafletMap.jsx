import React, { useEffect, useRef } from "react";

function LeafletMap() {
  // Use ref to store the map instance
  const mapRef = useRef(null);
  const scriptRef = useRef(null);
  const cssRef = useRef(null);

  useEffect(() => {
    // Only run on client-side
    if (typeof window !== "undefined") {
      // Check if Leaflet is already loaded
      if (!window.L) {
        // Add Leaflet CSS if not already added
        const existingCss = document.querySelector('link[href*="leaflet.css"]');
        if (!existingCss) {
          const leafletCss = document.createElement("link");
          leafletCss.rel = "stylesheet";
          leafletCss.href =
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/leaflet.css";
          document.head.appendChild(leafletCss);
          cssRef.current = leafletCss;
        }

        // Add Leaflet JS if not already added
        const existingScript = document.querySelector(
          'script[src*="leaflet.js"]'
        );
        if (!existingScript) {
          const leafletScript = document.createElement("script");
          leafletScript.src =
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.3/leaflet.js";

          leafletScript.onload = initializeMap;
          document.body.appendChild(leafletScript);
          scriptRef.current = leafletScript;
        } else {
          // If script already exists but map doesn't, initialize it
          if (window.L && !mapRef.current) {
            initializeMap();
          }
        }
      } else {
        // Leaflet is already loaded, initialize map if it doesn't exist
        if (!mapRef.current) {
          initializeMap();
        }
      }
    }

    function initializeMap() {
      // Check if map container exists and map hasn't been initialized
      const container = document.getElementById("mapContainer");
      if (container && !mapRef.current) {
        // Initialize map
        mapRef.current = L.map("mapContainer").setView([51.505, -0.09], 13);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 18,
        }).addTo(mapRef.current);
      }
    }

    // Cleanup function
    return () => {
      // Only remove if we created them and they still exist
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }

      // Only remove script/css if we added them ourselves
      if (scriptRef.current && document.body.contains(scriptRef.current)) {
        document.body.removeChild(scriptRef.current);
      }

      if (cssRef.current && document.head.contains(cssRef.current)) {
        document.head.removeChild(cssRef.current);
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="w-full">
      <div
        id="mapContainer"
        className="w-full h-80 bg-gray-700 rounded-lg"
      ></div>
    </div>
  );
}

export default LeafletMap;

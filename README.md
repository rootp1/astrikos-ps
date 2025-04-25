# 🚀 AstriVerse Platform – REST API Documentation

This document outlines all the backend API routes available for the AstriVerse microservices platform. These endpoints are ready for integration with any frontend (React, mobile, etc).

---

## 🔐 Authentication (NextAuth)
- **OAuth**: GitHub
- Handled internally via NextAuth
- Session info: `GET /api/auth/session`

---

## 🖼 Vector (2D) Assets

### `POST /api/vector2d/upload`
Upload a vector file (SVG, AI, EPS).
- **Form-Data**:
  - `file`: vector file
  - `tags`: comma-separated tags
  - `ownerID`: user ID

### `GET /api/vector2d/:id`
Fetch metadata for a single vector asset.

### `DELETE /api/vector2d/:id`
Delete a vector asset by ID.

### `GET /api/assets/vector2d`
Fetch all uploaded 2D vector assets.

---

## 🎮 3D Model Assets

### `POST /api/model3d/upload`
Upload `.glb` 3D model file.
- **Form-Data**:
  - `file`: .glb file
  - `tags`: comma-separated tags
  - `ownerID`: user ID

### `GET /api/model3d/:id`
Fetch metadata for a single 3D model.

### `DELETE /api/model3d/:id`
Delete a 3D model by ID.

### `GET /api/assets/model3d`
Fetch all uploaded 3D models.

---

## 🗺 Map Assets (GeoJSON)

### `POST /api/maps/upload`
Upload `.geojson` file.
- **Form-Data**:
  - `file`: GeoJSON file
  - `tags`: comma-separated tags
  - `ownerID`: user ID

### `GET /api/maps/:id`
Fetch metadata for a single map.

### `DELETE /api/maps/:id`
Delete a map file by ID.

### `GET /api/assets/maps`
Fetch all uploaded maps.

---

## 🏗 Scene Builder

### `POST /api/scenes/create`
Create a new scene.
- **JSON Body**:
```json
{
  "name": "Scene Name",
  "description": "...",
  "ownerId": "user123",
  "assets": [
    {
      "assetId": "...",
      "type": "2d" | "3d" | "map",
      "position": { "x": 0, "y": 0, "z": 0 },
      "rotation": { "x": 0, "y": 0, "z": 0 },
      "scale": { "x": 1, "y": 1, "z": 1 }
    }
  ]
}
```

### `GET /api/scenes/:id`
Get a scene by ID.

### `PUT /api/scenes/:id`
Update a scene.

### `DELETE /api/scenes/:id`
Delete a scene.

### `GET /api/scenes?ownerId=user123`
Get all scenes by owner ID.

---

## 📤 Export & Share

### `GET /api/export/scene/:id`
Export scene JSON (downloads `.json`).

### `POST /api/share/scene`
Create public share token.
- **JSON Body**: `{ "sceneId": "<scene-id>" }`
- **Response**: `{ publicUrl: "/api/share/scene/:token" }`

### `GET /api/share/scene/:token`
Fetch shared scene (read-only).

---

## 📦 Optional (Not Implemented Yet)

### `GET /api/download/scene/:id`
Package all referenced scene assets as ZIP. (Planned)

---

## 📝 Notes for Frontend Devs
- All routes return JSON.
- Auth-required pages can use `useSession()` from NextAuth.
- Files are served via `/public/uploads/...` or `/public/maps/...`
- Use route structure to dynamically load viewers.

---

> Backend completed ✅  |  Ready for UI integration 🚀


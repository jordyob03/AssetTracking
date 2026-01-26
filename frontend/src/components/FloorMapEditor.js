
// ================================
// File: src/components/FloorMapEditor.jsx
// ================================

import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer } from "react-konva";
import RoomNode from "./RoomNode";

export default function FloorMapEditor() {
  const stageRef = useRef(null);
  const fileInputRef = useRef(null);

  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const [roomWidth, setRoomWidth] = useState(5);
  const [roomHeight, setRoomHeight] = useState(4);

  // pixels per meter
  const [zoom, setZoom] = useState(50);

  const SNAP_DISTANCE = 0.2; // meters

  // -----------------------------
  // WebSocket (live asset feed)
  // -----------------------------
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:4000");

    ws.onmessage = (msg) => {
      const data = JSON.parse(msg.data);

      if (data.type === "asset_update") {
        setRooms((prev) =>
          prev.map((room) => ({
            ...room,
            assets: data.assets
              .filter((a) => a.roomId === room.id)
              .map((a) => ({
                id: a.id,
                name: a.name,
                x: a.x - room.x,
                y: a.y - room.y,
              })),
          }))
        );
      }
    };

    return () => ws.close();
  }, []);

  // -----------------------------
  // Overlap detection
  // -----------------------------
  const isOverlapping = (rect, ignoreId = null) => {
    return rooms.some((r) => {
      if (r.id === ignoreId) return false;

      return !(
        rect.x + rect.width <= r.x ||
        rect.x >= r.x + r.width ||
        rect.y + rect.height <= r.y ||
        rect.y >= r.y + r.height
      );
    });
  };

  // -----------------------------
  // Snap rooms
  // -----------------------------
  const snapRoom = (room, ignoreId) => {
    let snapped = { ...room };

    rooms.forEach((r) => {
      if (r.id === ignoreId) return;

      // Horizontal
      if (Math.abs(snapped.x - (r.x + r.width)) < SNAP_DISTANCE) {
        snapped.x = r.x + r.width;
      }
      if (Math.abs(snapped.x + snapped.width - r.x) < SNAP_DISTANCE) {
        snapped.x = r.x - snapped.width;
      }

      // Vertical
      if (Math.abs(snapped.y - (r.y + r.height)) < SNAP_DISTANCE) {
        snapped.y = r.y + r.height;
      }
      if (Math.abs(snapped.y + snapped.height - r.y) < SNAP_DISTANCE) {
        snapped.y = r.y - snapped.height;
      }
    });

    return snapped;
  };

  // -----------------------------
  // Create room
  // -----------------------------
  const handleMouseDown = (e) => {
    if (e.target !== stageRef.current) return;

    const pointer = stageRef.current.getPointerPosition();

    const newRoom = {
      id: Date.now(),
      name: `Room ${rooms.length + 1}`,
      x: pointer.x / zoom,
      y: pointer.y / zoom,
      width: roomWidth,
      height: roomHeight,
      assets: [],
    };

    if (!isOverlapping(newRoom)) {
      setRooms((prev) => [...prev, newRoom]);
    }
  };

  // -----------------------------
  // Move room
  // -----------------------------
  const moveRoom = (id, pos) => {
    setRooms((prev) =>
      prev.map((room) => {
        if (room.id !== id) return room;

        let updated = { ...room, ...pos };
        updated = snapRoom(updated, id);

        if (isOverlapping(updated, id)) return room;
        return updated;
      })
    );
  };

  // -----------------------------
  // Zoom
  // -----------------------------
  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? -1 : 1;

    setZoom((z) => (direction > 0 ? z * scaleBy : z / scaleBy));
  };

  // -----------------------------
  // Save JSON
  // -----------------------------
  const saveAsJSON = () => {
    const data = {
      units: "meters",
      zoom,
      rooms,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "floor-plan.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  // -----------------------------
  // Load JSON
  // -----------------------------
  const handleLoadFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);

        if (!Array.isArray(data.rooms)) {
          alert("Invalid floor plan file");
          return;
        }

        setRooms(data.rooms);
        if (typeof data.zoom === "number") {
          setZoom(data.zoom);
        }
      } catch {
        alert("Failed to load JSON file");
      }
    };

    reader.readAsText(file);
    e.target.value = null;
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Floor Map Editor</h2>

      <div className="flex flex-wrap gap-4 bg-gray-100 p-3 rounded items-center">
        <label className="flex items-center gap-2">
          Width (m)
          <input
            type="number"
            value={roomWidth}
            onChange={(e) => setRoomWidth(Number(e.target.value))}
            className="w-20 px-2 py-1 border rounded"
          />
        </label>

        <label className="flex items-center gap-2">
          Height (m)
          <input
            type="number"
            value={roomHeight}
            onChange={(e) => setRoomHeight(Number(e.target.value))}
            className="w-20 px-2 py-1 border rounded"
          />
        </label>

        <button
          onClick={saveAsJSON}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Save JSON
        </button>

        <button
          onClick={() => fileInputRef.current.click()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Load JSON
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleLoadFile}
          hidden
        />

        <span className="text-gray-600">
          Scroll to zoom · Click to place · Drag room to move
        </span>
      </div>

      <Stage
        width={800}
        height={600}
        ref={stageRef}
        scaleX={zoom}
        scaleY={zoom}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
        style={{ border: "2px solid #333", background: "#fafafa" }}
      >
        <Layer>
          {rooms.map((room) => (
            <RoomNode
              key={room.id}
              room={room}
              zoom={zoom}
              onMove={moveRoom}
              onSelect={setSelectedRoom}
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
}



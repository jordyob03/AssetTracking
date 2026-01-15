import React, { useState, useRef } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";

export default function FloorMapEditor() {
  const stageRef = useRef(null);
  const fileInputRef = useRef(null);

  // -----------------------------
  // Rooms stored in METERS
  // -----------------------------
  const [rectangles, setRectangles] = useState([]);

  const [roomWidth, setRoomWidth] = useState(5);
  const [roomHeight, setRoomHeight] = useState(4);

  // Global zoom: pixels per meter
  const [zoom, setZoom] = useState(50);

  const SNAP_DISTANCE = 0.2; // meters

  // -----------------------------
  // Overlap detection (meters)
  // -----------------------------
  const isOverlapping = (rect, ignoreId = null) => {
    return rectangles.some((r) => {
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
  // Snap rooms (meters)
  // -----------------------------
  const snapRect = (rect, ignoreId) => {
    let snapped = { ...rect };

    rectangles.forEach((r) => {
      if (r.id === ignoreId) return;

      // Horizontal snapping
      if (Math.abs(snapped.x - (r.x + r.width)) < SNAP_DISTANCE) {
        snapped.x = r.x + r.width;
      }
      if (Math.abs(snapped.x + snapped.width - r.x) < SNAP_DISTANCE) {
        snapped.x = r.x - snapped.width;
      }

      // Vertical snapping
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
  // Place new room
  // -----------------------------
  const handleMouseDown = (e) => {
    if (e.target !== stageRef.current) return;

    const pointer = stageRef.current.getPointerPosition();

    const rect = {
      id: Date.now(),
      x: pointer.x / zoom,
      y: pointer.y / zoom,
      width: roomWidth,
      height: roomHeight,
    };

    if (!isOverlapping(rect)) {
      setRectangles((prev) => [...prev, rect]);
    }
  };

  // -----------------------------
  // Drag logic
  // -----------------------------
  const handleDragEnd = (e, rect) => {
    const node = e.target;

    let updated = {
      ...rect,
      x: node.x(),
      y: node.y(),
    };

    updated = snapRect(updated, rect.id);

    if (isOverlapping(updated, rect.id)) {
      node.position({
        x: rect.x,
        y: rect.y,
      });
      node.getLayer().batchDraw();
    } else {
      setRectangles((prev) =>
        prev.map((r) => (r.id === rect.id ? updated : r))
      );
    }
  };

  // -----------------------------
  // Mouse wheel zoom
  // -----------------------------
  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? -1 : 1;

    setZoom((z) => (direction > 0 ? z * scaleBy : z / scaleBy));
  };

  // -----------------------------
  // Save as JSON
  // -----------------------------
  const saveAsJSON = () => {
    const data = {
      units: "meters",
      zoom,
      rooms: rectangles,
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
  // Load from JSON
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

        setRectangles(data.rooms);
        if (typeof data.zoom === "number") {
          setZoom(data.zoom);
        }
      } catch (err) {
        alert("Failed to load JSON file");
      }
    };

    reader.readAsText(file);
    e.target.value = null; // allow reloading same file
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Floor Map Editor</h2>

      {/* Controls */}
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
          className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
        >
          Save as JSON
        </button>

        <button
          onClick={() => fileInputRef.current.click()}
          className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary"
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
          Scroll to zoom · Click to place · Drag to move
        </span>
      </div>

      {/* Canvas */}
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
          {rectangles.map((rect) => (
            <React.Fragment key={rect.id}>
              <Rect
                x={rect.x}
                y={rect.y}
                width={rect.width}
                height={rect.height}
                fill="rgba(0,128,255,0.3)"
                stroke="black"
                strokeWidth={1 / zoom}
                draggable
                onDragEnd={(e) => handleDragEnd(e, rect)}
              />

              <Text
                x={rect.x + 0.1}
                y={rect.y + 0.1}
                text={`${rect.width}m × ${rect.height}m`}
                fontSize={0.3}
                fill="black"
                listening={false}
              />
            </React.Fragment>
          ))}
        </Layer>
      </Stage>
    </div>
  );
}

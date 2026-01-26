// ================================
// File: src/components/FloorMapViewer.jsx
// ================================

import React, { useRef, useState } from "react";
import { Stage, Layer, Rect, Text, Circle, Group } from "react-konva";

export default function FloorMapViewer({ floorData }) {
  const stageRef = useRef(null);

  const [zoom, setZoom] = useState(floorData.zoom || 50);

  // -----------------------------
  // Zoom with mouse wheel
  // -----------------------------
  const handleWheel = (e) => {
    e.evt.preventDefault();

    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? -1 : 1;

    setZoom((z) => (direction > 0 ? z * scaleBy : z / scaleBy));
  };

  // -----------------------------
  // Render
  // -----------------------------
  return (
    <Stage
      width={800}
      height={600}
      ref={stageRef}
      scaleX={zoom}
      scaleY={zoom}
      onWheel={handleWheel}
      style={{ border: "2px solid #333", background: "#fafafa" }}
    >
      <Layer>
        {floorData.rooms?.map((room) => (
          <Group key={room.id} x={room.x} y={room.y}>
            {/* Room rectangle */}
            <Rect
              width={room.width}
              height={room.height}
              fill="rgba(0,128,255,0.3)"
              stroke="black"
              strokeWidth={1 / zoom}
            />

            {/* Room label */}
            <Text
              x={0.1}
              y={0.1}
              text={`${room.name} (${room.width}m × ${room.height}m)`}
              fontSize={0.3}
              fill="black"
              listening={false}
            />

            {/* Assets (read-only) */}
            {(room.assets || []).map((asset) => (
              <Group key={asset.id} x={asset.x} y={asset.y}>
                <Circle radius={0.15} fill="orange" />
                <Text
                  x={0.2}
                  y={-0.1}
                  text={asset.name}
                  fontSize={0.25}
                  fill="black"
                />
              </Group>
            ))}
          </Group>
        ))}
      </Layer>
    </Stage>
  );
}

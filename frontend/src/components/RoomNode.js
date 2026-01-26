// ==================================================
// FRONTEND FILES
// ==================================================

// ================================
// File: src/components/RoomNode.jsx
// ================================

import React from "react";
import { Rect, Text, Circle, Group } from "react-konva";

export default function RoomNode({ room, zoom, onMove, onSelect }) {
  const handleDragEnd = (e) => {
    onMove(room.id, {
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return (
    <Group
      x={room.x}
      y={room.y}
      draggable
      onDragEnd={handleDragEnd}
      onClick={() => onSelect(room.id)}
    >
      {/* Room box */}
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

      {/* Fixed-position assets */}
      {room.assets.map((asset) => (
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
  );
}


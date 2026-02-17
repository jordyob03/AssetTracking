import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Text, Circle, Group } from "react-konva";

export default function FloorMapViewer({ floorData }) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  const [zoom, setZoom] = useState(floorData.zoom || 50);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  // -----------------------------
  // Resize to 80% of screen
  // -----------------------------
  useEffect(() => {
    const updateSize = () => {
      setStageSize({
        width: window.innerWidth * 0.8,
        height: window.innerHeight * 0.8,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

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
    <div
      ref={containerRef}
      style={{
        width: "80vw",
        height: "80vh",
        margin: "0 auto",
      }}
    >
      <Stage
        width={stageSize.width}
        height={stageSize.height}
        ref={stageRef}
        scaleX={zoom}
        scaleY={zoom}
        onWheel={handleWheel}
        style={{ border: "2px solid #333", background: "#fafafa" }}
      >
        <Layer>
          {floorData.rooms?.map((room) => (
            <Group key={room.id} x={room.x} y={room.y}>
              <Rect
                width={room.width}
                height={room.height}
                fill="rgba(0,128,255,0.3)"
                stroke="black"
                strokeWidth={1 / zoom}
              />

              <Text
                x={0.1}
                y={0.1}
                text={`${room.name} (${room.width}m × ${room.height}m)`}
                fontSize={0.3}
                fill="black"
                listening={false}
              />

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
    </div>
  );
}

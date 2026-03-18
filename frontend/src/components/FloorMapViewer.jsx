import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Rect, Text, Circle, Group, Line } from "react-konva";

export default function FloorMapViewer({
  floorData,
  assets = [],
  assetTypes = {},
  visibleTypes = {}
}) {
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  const [zoom, setZoom] = useState(floorData.zoom || 50);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const updateSize = () => {
      setStageSize({
        width: window.innerWidth * 0.7,
        height: window.innerHeight * 0.8,
      });
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleWheel = (e) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    setZoom((z) => (direction > 0 ? z * scaleBy : z / scaleBy));
  };

  const ICON_RADIUS = 0.2;
  const PADDING = 0.5;

  const getInitials = (name) =>
    name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

  return (
    <div ref={containerRef} style={{ width: "100%", height: "80vh", margin: "0 auto" }}>
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

          {/* 🏠 ROOMS + GRID ASSETS */}
          {floorData.rooms?.map((room) => {
            const roomAssets = assets.filter(
              (a) =>
                a.roomId === room.id &&
                visibleTypes[a.type] &&
                (a.x === undefined || a.y === undefined) // only old system
            );

            const count = roomAssets.length;

            const usableW = Math.max(room.width - PADDING * 2, 0.1);
            const usableH = Math.max(room.height - PADDING * 2, 0.1);

            const cols = count > 0 ? Math.ceil(Math.sqrt(count)) : 1;
            const rows = count > 0 ? Math.ceil(count / cols) : 1;

            const cellW = usableW / cols;
            const cellH = usableH / rows;

            return (
              <Group key={room.id} x={room.x} y={room.y}>
                <Rect
                  width={room.width}
                  height={room.height}
                  fill="rgba(0,128,255,0.25)"
                  stroke="black"
                  strokeWidth={1 / zoom}
                />

                <Text
                  x={0.15}
                  y={0.15}
                  text={room.name}
                  fontSize={0.35}
                  fill="black"
                  listening={false}
                />

                {roomAssets.map((asset, i) => {
                  const col = i % cols;
                  const row = Math.floor(i / cols);

                  const x = PADDING + col * cellW + cellW / 2;
                  const y = PADDING + row * cellH + cellH / 2;

                  const radius =
                    asset.type === "nurse"
                      ? ICON_RADIUS * 1.8
                      : ICON_RADIUS;

                  const isInUse = asset.inUse;

                  const xSize = radius * 0.6;

                  return (
                    <Group key={asset.id} x={x} y={y}>
                      <Circle
                        radius={radius}
                        fill={assetTypes[asset.type]?.color || "gray"}
                        opacity={isInUse ? 0.7 : 1}
                      />

                      {asset.type === "nurse" && (
                        <Text
                          text={getInitials(asset.name)}
                          fontSize={0.35}
                          fill="white"
                          width={radius * 2}
                          align="center"
                          offsetX={radius}
                          offsetY={0.18}
                        />
                      )}

                      {isInUse && (
                        <>
                          <Line
                            points={[-xSize, -xSize, xSize, xSize]}
                            stroke="black"
                            strokeWidth={0.04}
                          />
                          <Line
                            points={[-xSize, xSize, xSize, -xSize]}
                            stroke="black"
                            strokeWidth={0.04}
                          />
                        </>
                      )}
                    </Group>
                  );
                })}
              </Group>
            );
          })}

          {/* 🌍 GLOBAL COORDINATE ASSETS */}
          {assets
            .filter(a => a.x !== undefined && a.y !== undefined && visibleTypes[a.type])
            .map(asset => {
              const radius =
                asset.type === "nurse" ? ICON_RADIUS * 1.8 : ICON_RADIUS;

              return (
                <Group key={asset.id} x={asset.x} y={asset.y}>
                  <Circle
                    radius={radius}
                    fill={assetTypes[asset.type]?.color || "gray"}
                  />

                  {asset.type === "nurse" && (
                    <Text
                      text={getInitials(asset.name)}
                      fontSize={0.35}
                      fill="white"
                      width={radius * 2}
                      align="center"
                      offsetX={radius}
                      offsetY={0.18}
                    />
                  )}
                </Group>
              );
            })}

        </Layer>
      </Stage>
    </div>
  );
}
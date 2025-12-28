import { Stage, Layer, Circle, Text } from "react-konva";

export default function MapCanvas({ assets }) {
  return (
    <Stage width={600} height={400} className="border-2 border-gray-400">
      <Layer>
        {Object.values(assets).map(a => (
          <Circle key={a.id} x={a.x} y={a.y} radius={10} fill="blue" />
        ))}
        <Text text="Room Map" x={10} y={10} />
      </Layer>
    </Stage>
  );
}
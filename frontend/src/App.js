import useWS from "./hooks/useWS";
import MapCanvas from "./components/MapCanvas";

export default function App() {
  const assets = useWS("ws://localhost:4000");

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Indoor Asset Tracking MVP</h1>

      <MapCanvas assets={assets} />

      <pre>{JSON.stringify(assets, null, 2)}</pre>
    </div>
  );
}

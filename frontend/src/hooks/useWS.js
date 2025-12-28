import { useEffect, useState } from "react";

export default function useWS(url) {
  const [assets, setAssets] = useState({});

  useEffect(() => {
    const ws = new WebSocket(url);

    ws.onmessage = e => {
      const msg = JSON.parse(e.data);

      if (msg.type === "asset_update") {
        setAssets(prev => ({ ...prev, [msg.asset.id]: msg.asset }));
      }
    };
  }, [url]);

  return assets;
}

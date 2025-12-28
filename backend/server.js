require("dotenv").config();
const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");

const app = express();
app.use(cors());
app.use(express.json());

// --- HTTP API Example ---
app.get("/api/assets", (req, res) => {
  res.json({ message: "Backend running", assets: [] });
});

// --- WebSocket server ---
const server = app.listen(process.env.PORT || 4000, () =>
  console.log("Backend running on port", process.env.PORT || 4000)
);

const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {
  console.log("Frontend connected");
  ws.send(JSON.stringify({ type: "hello", msg: "WebSocket OK" }));

  ws.on("message", data => console.log("Client says:", data));
});

// Broadcast helper
function broadcast(payload) {
  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN)
      client.send(JSON.stringify(payload));
  });
}

// simulate tag movement
setInterval(() => {
  broadcast({
    type: "asset_update",
    asset: {
      id: "tag1",
      x: Math.floor(Math.random() * 500),
      y: Math.floor(Math.random() * 500)
    }
  });
}, 2000);

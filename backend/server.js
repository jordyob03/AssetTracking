require("dotenv").config();
const express = require("express");
const cors = require("cors");
const WebSocket = require("ws");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;
const FLOOR_FILE = "./floor-plan.json";


function loadFloor() {
  try {
    return JSON.parse(fs.readFileSync(FLOOR_FILE));
  } catch {
    return { rooms: [] };
  }
}


const assets = {
  tag1: { id: "tag1", name: "Heart Monitor A", roomId: null },
  tag2: { id: "tag2", name: "Heart Monitor B", roomId: null },
};

const ROOM_PATH = [
  "Room 401",
  "Hall",
  "Room 402",
  "Hall",
  "Room 403",
  "Hall",
];

let pathIndex = 0;

app.get("/api/assets", (req, res) => {
  res.json(Object.values(assets));
});

const server = app.listen(PORT, () => {
  console.log("Backend running on port", PORT);
});

const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
  console.log("Frontend connected");
  ws.send(JSON.stringify({ type: "hello" }));
});

// ----------------------------
// Broadcast helper
// ----------------------------
function broadcast(payload) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });
}

// ----------------------------
// Room cycle loop (shared)
// ----------------------------
setInterval(() => {
  const floor = loadFloor();

  const nextRoomName = ROOM_PATH[pathIndex % ROOM_PATH.length];
  const room = floor.rooms.find(r => r.name === nextRoomName);

  if (room) {
    Object.values(assets).forEach(asset => {
      asset.roomId = room.id;
      console.log(`${asset.name} → ${room.name}`);
    });
  }

  pathIndex++;

  broadcast({
    type: "asset_update",
    assets: Object.values(assets),
  });

}, 2000);

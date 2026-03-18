const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 5000 });

console.log("📡 Position server running on ws://localhost:5000");

const assets = {
  tag1: { id: "tag1", name: "Heart Monitor 1", x: 2, y: 2, type: "heart_monitor" },
  tag2: { id: "tag2", name: "Nurse Amy", x: 4, y: 3, type: "nurse" },
  tag3: { id: "tag3", name: "Stretcher", x: 6, y: 2, type: "stretcher" },
};

wss.on("connection", (ws) => {
  console.log("Client connected to position server");
});

setInterval(() => {
  Object.values(assets).forEach(a => {
    a.x += (Math.random() - 0.5) * 0.3;
    a.y += (Math.random() - 0.5) * 0.3;
  });

  const payload = {
    type: "position_update",
    assets: Object.values(assets),
  };

  wss.clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(payload));
    }
  });

}, 1000);
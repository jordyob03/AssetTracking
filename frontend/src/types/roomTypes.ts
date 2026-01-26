export type Asset = {
  id: number;
  name: string;
  x: number; // meters, relative to room
  y: number; // meters, relative to room
};

export type Room = {
  id: number;
  name: string;
  x: number; // meters (world)
  y: number; // meters (world)
  width: number; // meters
  height: number; // meters
  assets: Asset[];
};
export default class Room {
  constructor({ id, name, x, y, width, height, assets = [] }) {
    this.id = id || Date.now();
    this.name = name || "Room";
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.assets = assets;
  }

  containsPoint(x, y) {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }

  overlaps(other) {
    return !(
      this.x + this.width <= other.x ||
      this.x >= other.x + other.width ||
      this.y + this.height <= other.y ||
      this.y >= other.y + other.height
    );
  }


  addAsset(asset) {
    this.assets.push(asset);
  }

  getAssetById(id) {
    return this.assets.find((a) => a.id === id);
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      assets: this.assets,
    };
  }

  static fromJSON(data) {
    return new Room(data);
  }
  
}

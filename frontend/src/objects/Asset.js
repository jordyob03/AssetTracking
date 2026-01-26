export default class Asset {
  constructor({ id, name, x, y }) {
    this.id = id || Date.now();
    this.name = name || "Asset";
    this.x = x;
    this.y = y;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      x: this.x,
      y: this.y,
    };
  }

  static fromJSON(data) {
    return new Asset(data);
  }
}

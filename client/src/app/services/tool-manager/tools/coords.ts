import { Point } from '../../../interfaces/point';

export class Coords {

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  x: number;
  y: number;

  static toPoint(coords: Coords): Point {
    return {
      x: coords.x,
      y: coords.y,
    } as Point;
  }

  toString(): string {
    return this.x.toString() + ', ' + this.y.toString();
  }
}

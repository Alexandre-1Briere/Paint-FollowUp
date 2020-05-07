import { SvgType } from '../../../enums/svg';
import { Point } from '../../../interfaces/point';
import { Coords } from '../../../services/tool-manager/tools/coords';
import { Boundary } from '../../collisions/base-collision/boundary';
import { Collidable } from '../../collisions/base-collision/collidable';
import { SetOfPoints } from '../../collisions/points/set-of-points';
import { PolygonCollidable } from '../../collisions/polygon/polygon-collidable';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import { SvgProperties } from '../base-svg/svg-properties';
import { SvgUtils } from '../utils/svg-utils';

const DEFAULT_THICKNESS = 5;

export class SvgBucketProperties extends SvgProperties {

  points: Point[][];

  path: string;
  thickness: number;

  maxX: number;
  maxY: number;
  center: Point;

  constructor() {
    super(SvgType.SvgBucketComponent);
    this.points = [];

    this.path = '';
    this.thickness = DEFAULT_THICKNESS;
  }

  adjustBoundingCoords(start: Coords, end: Coords): void {
    this.x = Math.min(start.x, this.x);
    this.y = Math.min(start.y, this.y);
    this.maxX = Math.max(end.x, this.maxX);
    this.maxY = Math.max(end.y, this.maxY);
  }

  computeCenter(): void {
    const points: Point[] = [];
    for (const subPoints of this.points) {
      points.push(...subPoints);
    }
    this.center = SvgUtils.getCenter(points);
  }

  translate(delta: Point): void {
    const points: Point[] = [];
    for (const subPoints of this.points) {
      points.push(...subPoints);
    }
    SvgUtils.translateAll(delta, points);
    this.createPathFromPoints();
  }
  rotateClockwise(degrees: number): void {
    this.computeCenter();
    const points: Point[] = [];
    for (const subPoints of this.points) {
      points.push(...subPoints);
    }
    SvgUtils.rotateClockWise(degrees, this.center, points);
    this.createPathFromPoints();
  }

  scale(percentage: number, direction: Point): void {
    this.computeCenter();
    const points: Point[] = [];
    for (const subPoints of this.points) {
      points.push(...subPoints);
    }
    SvgUtils.scalePoints(points, {x: this.x, y: this.y}, percentage, direction);
    this.createPathFromPoints();
  }

  createPathFromPoints(): void {
    let newPath = '';
    for (const [start, end] of this.points) {
      newPath += `M ${start.x} ${start.y} V ${end.y + 1} `;
    }
    this.path = newPath;
  }

  createPaths(map: boolean[][]): void {
    for (let x = 0; x < map.length; x++) {
      let start: Coords | undefined;
      const mapX = map[x];

      let prevState = false;
      let thisState = false;
      let nextState = 1 < mapX.length && mapX[1];

      for (let y = 0; y < mapX.length; y++) {
        prevState = thisState;
        thisState = nextState;
        nextState = (y + 1) < mapX.length && mapX[y + 1];

        if (thisState) {
          if (!prevState) {
            start = new Coords(x, y);
          }
          if (!nextState && start) {
            this.points.push([Coords.toPoint(start), {x, y}]);
            start = undefined;
          }
        }
      }
    }
    this.createPathFromPoints();
  }

  computeMinMaxXY(): void {

    if (this.points.length === 0) { return; }

    this.x = this.points[0][0].x;
    this.y = this.points[0][0].y;
    this.maxX = this.points[0][0].x;
    this.maxY = this.points[0][0].y;

    for (const subPoints of this.points) {
      this.adjustBoundingCoords(
          new Coords(subPoints[0].x, subPoints[0].y),
          new Coords(subPoints[1].x, subPoints[1].y),
      );
    }

    this.computeCenter();
  }

  getCollidables(): Collidable[] {
    const hitbox: Collidable[] = [];
    for (const subPoints of this.points) {
      const setOfPoints = new SetOfPoints(subPoints, this.thickness);
      hitbox.push(...setOfPoints.getCollidables());
    }
    return hitbox;
  }

  getBoundary(): Boundary {
    this.computeMinMaxXY();

    const topLeft = {x: this.x, y: this.y};
    const bottomRight = {x: this.maxX, y: this.maxY};

    return BoundaryBox.create([topLeft, bottomRight]);
  }

  getSelection(): PolygonCollidable {
    const topLeft = {x: this.x, y: this.y};
    const topRight = {x: this.maxX, y: this.y};
    const bottomRight = {x: this.maxX, y: this.maxY};
    const bottomLeft = {x: this.x, y: this.maxY};
    return new PolygonCollidable([topLeft, topRight, bottomRight, bottomLeft]);
  }

}

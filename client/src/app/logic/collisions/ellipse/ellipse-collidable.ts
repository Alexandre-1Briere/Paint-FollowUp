import {Point} from '../../../interfaces/point';
import {Boundary} from '../base-collision/boundary';
import {Collidable} from '../base-collision/collidable';
import {LinearProjection} from '../base-collision/linear-projection';
import {Projection} from '../utils/projection';

export class EllipseCollidable implements Collidable {
  private center: Point;
  private radiusX: number;
  private radiusY: number;
  private angleRadians: number;

  constructor(center: Point, radiusX: number, radiusY: number, angleRadians: number) {
    this.center = center;
    this.radiusX = radiusX;
    this.radiusY = radiusY;
    this.angleRadians = angleRadians;
  }

  getNormals(boundary: Boundary): Point[] {
    // Note: This gives an accurate approximation, without doing any complicated math
    return [
      {x: 0.1, y: 1},
      {x: 0.25, y: 1},
      {x: 0.5, y: 1},
      {x: 1, y: 1},
      {x: 1, y: 0.5},
      {x: 1, y: 0.25},
      {x: 1, y: 0.1},
      {x: -0.1, y: 1},
      {x: -0.25, y: 1},
      {x: -0.5, y: 1},
      {x: -1, y: 1},
      {x: -1, y: 0.5},
      {x: -1, y: 0.25},
      {x: -1, y: 0.1},
      Projection.getParallelAxis(this.center, boundary.center),
    ];
  }

  getLinearProjection(axis: Point): LinearProjection {
    const projection = Projection.getLinearProjection([this.center], axis);

    let angle = Math.PI / 2;
    if (axis.x !== 0) {
      angle = Math.atan(axis.y / axis.x);
    }
    let cosAngleSquared = Math.cos(angle - this.angleRadians);
    cosAngleSquared *= cosAngleSquared;
    const sinAngleSquared = 1 - cosAngleSquared;

    const RADIUS_AT_ANGLE = Math.sqrt(
      this.radiusX * this.radiusX * cosAngleSquared +
      this.radiusY * this.radiusY * sinAngleSquared,
    );
    projection.start -= Projection.getProjectionOffset(RADIUS_AT_ANGLE, axis);
    projection.end += Projection.getProjectionOffset(RADIUS_AT_ANGLE, axis);
    return projection;
  }
}

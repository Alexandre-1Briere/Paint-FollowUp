import {Point} from '../../../interfaces/point';
import {Boundary} from '../base-collision/boundary';
import {Collidable} from '../base-collision/collidable';
import {LinearProjection} from '../base-collision/linear-projection';
import {BoundaryBox} from '../utils/boundary-box';
import {Projection} from '../utils/projection';

export class PolygonCollidable implements Collidable {
  private points: Point[];
  private boundary: Boundary;

  constructor(points: Point[]) {
    this.points = points;
    this.boundary = BoundaryBox.create(this.points);
  }

  static createRectangle(topLeft: Point, bottomRight: Point): PolygonCollidable {
    const RECTANGLE_POINTS = [
      {x: topLeft.x, y: topLeft.y},
      {x: bottomRight.x, y: topLeft.y},
      {x: bottomRight.x, y: bottomRight.y},
      {x: topLeft.x, y: bottomRight.y},
    ];
    return new PolygonCollidable(RECTANGLE_POINTS);
  }

  static createCursor(center: Point): PolygonCollidable {
    const SIDE_HALF_LENGTH = 0.5;
    return this.createRectangle(
      {x: center.x - SIDE_HALF_LENGTH, y: center.y - SIDE_HALF_LENGTH},
      {x: center.x + SIDE_HALF_LENGTH, y: center.y + SIDE_HALF_LENGTH},
    );
  }

  getNormals(boundary: Boundary): Point[] {
    const MINIMUM_POINTS = 3;
    const normals = [];
    if (this.points.length >= MINIMUM_POINTS) {
      const LAST = this.points.length - 1;
      for (let index = 0; index < LAST; ++index) {
        normals.push(Projection.getNormalAxis(this.points[index], this.points[index + 1]));
      }
      normals.push(Projection.getNormalAxis(this.points[LAST], this.points[0]));
    }

    return normals;
  }

  getLinearProjection(axis: Point): LinearProjection {
    return Projection.getLinearProjection(this.points, axis);
  }

  getBoundary(): Boundary {
    return this.boundary;
  }
}

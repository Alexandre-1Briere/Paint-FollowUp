import {Point} from '../../../interfaces/point';
import {Boundary} from '../base-collision/boundary';
import {Collidable} from '../base-collision/collidable';
import {LinearProjection} from '../base-collision/linear-projection';
import {Projection} from '../utils/projection';

export class LineCollidable implements Collidable {
  point1: Point;
  point2: Point;
  thickness: number;

  constructor(point1: Point, point2: Point, thickness: number) {
    this.point1 = point1;
    this.point2 = point2;
    this.thickness = thickness;
  }

  getNormals(boundary: Boundary): Point[] {
    const normals = [];
    normals.push(Projection.getParallelAxis(this.point1, this.point2));
    normals.push(Projection.getNormalAxis(this.point1, this.point2));
    if (this.thickness > 0) {
      normals.push(Projection.getParallelAxis(this.point1, boundary.center));
      normals.push(Projection.getParallelAxis(this.point2, boundary.center));
    }
    return normals;
  }

  getLinearProjection(axis: Point): LinearProjection {
    const HALF_THICKNESS = this.thickness / 2;
    const projection = Projection.getLinearProjection([this.point1, this.point2], axis);
    projection.start -= Projection.getProjectionOffset(HALF_THICKNESS, axis);
    projection.end += Projection.getProjectionOffset(HALF_THICKNESS, axis);
    return projection;
  }
}

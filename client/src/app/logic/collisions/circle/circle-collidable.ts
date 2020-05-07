import {Point} from '../../../interfaces/point';
import {Boundary} from '../base-collision/boundary';
import {Collidable} from '../base-collision/collidable';
import {LinearProjection} from '../base-collision/linear-projection';
import {Projection} from '../utils/projection';

export class CircleCollidable implements Collidable {
  private center: Point;
  private radius: number;

  constructor(center: Point, radius: number) {
    this.center = center;
    this.radius = radius;
  }

  getNormals(boundary: Boundary): Point[] {
    return [Projection.getParallelAxis(this.center, boundary.center)];
  }

  getLinearProjection(axis: Point): LinearProjection {
    const projection = Projection.getLinearProjection([this.center], axis);
    projection.start -= Projection.getProjectionOffset(this.radius, axis);
    projection.end += Projection.getProjectionOffset(this.radius, axis);
    return projection;
  }
}

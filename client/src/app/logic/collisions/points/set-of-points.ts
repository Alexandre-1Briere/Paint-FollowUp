import {Point} from '../../../interfaces/point';
import {Boundary} from '../base-collision/boundary';
import {Collidable, SetOfCollidables} from '../base-collision/collidable';
import {CircleCollidable} from '../circle/circle-collidable';
import {LineCollidable} from '../line/line-collidable';
import {BoundaryBox} from '../utils/boundary-box';

export class SetOfPoints implements SetOfCollidables {
  private points: Point[];
  private boundary: Boundary;
  thickness: number;

  constructor(points: Point[], thickness: number) {
    this.points = points;
    this.thickness = thickness;
    this.boundary = BoundaryBox.create(this.points);
  }

  getCollidables(): Collidable[] {
    const collidables = [];
    const NUMBER_LINES = this.points.length - 1;
    for (let index = 0; index < NUMBER_LINES; ++index) {
      collidables.push(
        new LineCollidable(
          this.points[index],
          this.points[index + 1],
          this.thickness,
        ),
      );
    }
    if (this.points.length === 1) {
      collidables.push(new CircleCollidable(this.points[0], this.thickness / 2));
    }

    return collidables;
  }

  getNegativeCollidables(): Collidable[] {
    return [];
  }

  getBoundary(): Boundary {
    const HALF_THICKNESS = this.thickness / 2;
    return {
      topLeft: {
        x: this.boundary.topLeft.x - HALF_THICKNESS,
        y: this.boundary.topLeft.y - HALF_THICKNESS,
      },
      bottomRight: {
        x: this.boundary.bottomRight.x + HALF_THICKNESS,
        y: this.boundary.bottomRight.y + HALF_THICKNESS,
      },
      center: {
        x: this.boundary.center.x,
        y: this.boundary.center.y,
      },
    };
  }
}

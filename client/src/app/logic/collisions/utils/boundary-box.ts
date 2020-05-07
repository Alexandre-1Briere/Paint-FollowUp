import {Point} from '../../../interfaces/point';
import {Boundary} from '../base-collision/boundary';
import {SetOfCollidables} from '../base-collision/collidable';

const NO_VALUE = -1000000;

export class BoundaryBox {
  static create(points: Point[]): Boundary {
    const boundary = {
      topLeft: {x: NO_VALUE, y: NO_VALUE},
      bottomRight: {x: NO_VALUE, y: NO_VALUE},
      center: {x: NO_VALUE, y: NO_VALUE},
    };

    if (points.length > 0) {
      boundary.topLeft.x = points[0].x;
      boundary.topLeft.y = points[0].y;
      boundary.bottomRight.x = points[0].x;
      boundary.bottomRight.y = points[0].y;
    }

    for (let index = 1; index < points.length; ++index) {
      boundary.topLeft.x = Math.min(boundary.topLeft.x, points[index].x);
      boundary.topLeft.y = Math.min(boundary.topLeft.y, points[index].y);
      boundary.bottomRight.x = Math.max(boundary.bottomRight.x, points[index].x);
      boundary.bottomRight.y = Math.max(boundary.bottomRight.y, points[index].y);
    }

    boundary.center = {
      x: (boundary.topLeft.x + boundary.bottomRight.x) / 2,
      y: (boundary.topLeft.y + boundary.bottomRight.y) / 2,
    };

    return boundary;
  }

  static containing(setsOfCollidables: SetOfCollidables[]): Boundary | undefined {
    const points = [];
    for (const setOfCollidables of setsOfCollidables) {
      const boundary = setOfCollidables.getBoundary();
      points.push(boundary.topLeft);
      points.push(boundary.bottomRight);
    }

    if (points.length === 0) {
      return undefined;
    } else {
      return BoundaryBox.create(points);
    }
  }
}

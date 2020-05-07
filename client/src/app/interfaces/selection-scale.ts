import {Point} from './point';

export interface SelectionScale {
  success: boolean;
  fixedPoint: Point;
  grabbedPoint: Point;
  movedGrabbedPoint: Point;
}

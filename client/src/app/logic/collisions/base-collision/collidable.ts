import {Point} from '../../../interfaces/point';
import {Boundary} from './boundary';
import {LinearProjection} from './linear-projection';

export interface Collidable {
  getNormals(selection: Boundary): Point[];
  getLinearProjection(axis: Point): LinearProjection;
}

export interface SetOfCollidables {
  getCollidables(): Collidable[];
  getNegativeCollidables(): Collidable[];
  getBoundary(): Boundary;
}

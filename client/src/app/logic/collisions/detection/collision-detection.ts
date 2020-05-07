import {Boundary} from '../base-collision/boundary';
import {Collidable, SetOfCollidables} from '../base-collision/collidable';
import {PolygonCollidable} from '../polygon/polygon-collidable';
import {Projection} from '../utils/projection';

export enum FastCheck {
  NoCollision,
  Uncertain,
  Collision,
}

export class CollisionDetection {
  static checkCollidablesIntersection(setOfCollidables: SetOfCollidables, selection: PolygonCollidable): boolean {

    const fastCheck = CollisionDetection.fastCheckCollision(setOfCollidables.getBoundary(), selection.getBoundary());
    switch (fastCheck) {
      case FastCheck.NoCollision:
        return false;
      case FastCheck.Collision:
        return true;
    }

    const negativeCollidables = setOfCollidables.getNegativeCollidables();
    for (const negativeCollidable of negativeCollidables) {
      if (CollisionDetection.checkIfSelectionIsInside(selection, negativeCollidable)) {
        return false;
      }
    }

    const collidables = setOfCollidables.getCollidables();
    for (const collidable of collidables) {
      if (CollisionDetection.checkIntersection(collidable, selection)) {
        return true;
      }
    }

    return false;
  }

  static checkIntersection(collidable: Collidable, selection: PolygonCollidable): boolean {
    const collidablesNormals = collidable.getNormals(selection.getBoundary());
    const selectionNormals = selection.getNormals(selection.getBoundary());
    const normals = collidablesNormals.concat(selectionNormals);

    for (const normal of normals) {
      if (!Projection.overlapping(collidable.getLinearProjection(normal), selection.getLinearProjection(normal))) {
        return false;
      }
    }

    return true;
  }

  static checkIfSelectionIsInside(selection: PolygonCollidable, collidable: Collidable): boolean {
    const selectionNormals = selection.getNormals(selection.getBoundary());
    const collidablesNormals = collidable.getNormals(selection.getBoundary());
    const normals = collidablesNormals.concat(selectionNormals);

    for (const normal of normals) {
      if (!Projection.isInside(selection.getLinearProjection(normal), collidable.getLinearProjection(normal))) {
        return false;
      }
    }

    return true;
  }

  static fastCheckCollision(boundary: Boundary, selection: Boundary): FastCheck {
    if ((boundary.bottomRight.x <= selection.topLeft.x ||
        selection.bottomRight.x <= boundary.topLeft.x) &&
        (boundary.bottomRight.y <= selection.topLeft.y ||
        selection.bottomRight.y <= boundary.topLeft.y)) {
      return FastCheck.NoCollision;
    }

    if (boundary.bottomRight.x <= selection.bottomRight.x &&
        boundary.bottomRight.y <= selection.bottomRight.y &&
        selection.topLeft.x <= boundary.topLeft.x &&
        selection.topLeft.y <= boundary.topLeft.y) {
      return FastCheck.Collision;
    }

    return FastCheck.Uncertain;
  }
}

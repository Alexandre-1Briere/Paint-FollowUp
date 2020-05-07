import {SvgRectangleProperties} from '../../svg/rectangle/svg-rectangle-properties';
import {PolygonCollidable} from '../polygon/polygon-collidable';
import {CollisionDetection, FastCheck} from './collision-detection';

describe('CollisionDetection', () => {
  it('should create an instance', () => {
    expect(new CollisionDetection()).toBeTruthy();
  });

  it('#checkCollidablesIntersection() returns true when 1 collidable is in contact with selection', () => {
    const X1 = 0;
    const Y1 = 0;
    const X2 = 10;
    const Y2 = 10;
    const rectangle = new SvgRectangleProperties();
    rectangle.fitExactlyInside(X1, Y1, X2, Y2);

    const TOP_LEFT = {x: 5, y: 5};
    const BOTTOM_RIGHT = {x: 15, y: 15};
    const selection = PolygonCollidable.createRectangle(TOP_LEFT, BOTTOM_RIGHT);

    expect(CollisionDetection.checkCollidablesIntersection(rectangle, selection)).toBeTruthy();
  });

  it('#checkCollidablesIntersection() returns false when no collidable is in contact with selection', () => {
    const X1 = 0;
    const Y1 = 0;
    const X2 = 10;
    const Y2 = 10;
    const rectangle = new SvgRectangleProperties();
    rectangle.fitExactlyInside(X1, Y1, X2, Y2);

    const TOP_LEFT = {x: 11, y: 11};
    const BOTTOM_RIGHT = {x: 15, y: 15};
    const selection = PolygonCollidable.createRectangle(TOP_LEFT, BOTTOM_RIGHT);

    expect(CollisionDetection.checkCollidablesIntersection(rectangle, selection)).toBeFalsy();
  });

  it('#checkCollidablesIntersection() returns false when selection is inside a negativeCollidable', () => {
    const X1 = 0;
    const Y1 = 0;
    const X2 = 100;
    const Y2 = 100;
    const rectangle = new SvgRectangleProperties();
    rectangle.fitExactlyInside(X1, Y1, X2, Y2);
    rectangle.displayFill = false;

    const TOP_LEFT = {x: 30, y: 30};
    const BOTTOM_RIGHT = {x: 70, y: 70};
    const selection = PolygonCollidable.createRectangle(TOP_LEFT, BOTTOM_RIGHT);

    expect(CollisionDetection.checkCollidablesIntersection(rectangle, selection)).toBeFalsy();
  });

  it('#checkCollidablesIntersection() returns true when selection is partially inside a negativeCollidable', () => {
    const X1 = 0;
    const Y1 = 0;
    const X2 = 100;
    const Y2 = 100;
    const rectangle = new SvgRectangleProperties();
    rectangle.fitExactlyInside(X1, Y1, X2, Y2);
    rectangle.displayFill = false;

    const TOP_LEFT = {x: 30, y: 30};
    const BOTTOM_RIGHT = {x: 105, y: 105};
    const selection = PolygonCollidable.createRectangle(TOP_LEFT, BOTTOM_RIGHT);

    expect(CollisionDetection.checkCollidablesIntersection(rectangle, selection)).toBeTruthy();
  });

  it('#checkIntersection() returns false when rectangles are apart', () => {
    const TOP_LEFT1 = {x: 0, y: 0};
    const BOTTOM_RIGHT1 = {x: 10, y: 10};
    const rectangle1 = PolygonCollidable.createRectangle(TOP_LEFT1, BOTTOM_RIGHT1);

    const TOP_LEFT2 = {x: 11, y: 11};
    const BOTTOM_RIGHT2 = {x: 20, y: 20};
    const rectangle2 = PolygonCollidable.createRectangle(TOP_LEFT2, BOTTOM_RIGHT2);

    expect(CollisionDetection.checkIntersection(rectangle1, rectangle2)).toBeFalsy();
    expect(CollisionDetection.checkIntersection(rectangle2, rectangle1)).toBeFalsy();
  });

  it('#checkIntersection() returns true when rectangles are in contact', () => {
    const TOP_LEFT1 = {x: 0, y: 0};
    const BOTTOM_RIGHT1 = {x: 10, y: 10};
    const rectangle1 = PolygonCollidable.createRectangle(TOP_LEFT1, BOTTOM_RIGHT1);

    const TOP_LEFT2 = {x: 9, y: 9};
    const BOTTOM_RIGHT2 = {x: 20, y: 20};
    const rectangle2 = PolygonCollidable.createRectangle(TOP_LEFT2, BOTTOM_RIGHT2);

    expect(CollisionDetection.checkIntersection(rectangle1, rectangle2)).toBeTruthy();
    expect(CollisionDetection.checkIntersection(rectangle2, rectangle1)).toBeTruthy();
  });

  it('#checkIfSelectionIsInside() returns true when selection is inside rectangle', () => {
    const TOP_LEFT1 = {x: 1, y: 1};
    const BOTTOM_RIGHT1 = {x: 9, y: 9};
    const selection = PolygonCollidable.createRectangle(TOP_LEFT1, BOTTOM_RIGHT1);

    const TOP_LEFT2 = {x: 0, y: 0};
    const BOTTOM_RIGHT2 = {x: 10, y: 10};
    const rectangle = PolygonCollidable.createRectangle(TOP_LEFT2, BOTTOM_RIGHT2);

    expect(CollisionDetection.checkIfSelectionIsInside(selection, rectangle)).toBeTruthy();
    expect(CollisionDetection.checkIfSelectionIsInside(rectangle, selection)).toBeFalsy();
  });

  it('#checkIfSelectionIsInside() returns false when selection is partially inside rectangle', () => {
    const TOP_LEFT1 = {x: 0, y: 0};
    const BOTTOM_RIGHT1 = {x: 8, y: 8};
    const selection = PolygonCollidable.createRectangle(TOP_LEFT1, BOTTOM_RIGHT1);

    const TOP_LEFT2 = {x: 6, y: 6};
    const BOTTOM_RIGHT2 = {x: 10, y: 10};
    const rectangle = PolygonCollidable.createRectangle(TOP_LEFT2, BOTTOM_RIGHT2);

    expect(CollisionDetection.checkIfSelectionIsInside(selection, rectangle)).toBeFalsy();
    expect(CollisionDetection.checkIfSelectionIsInside(rectangle, selection)).toBeFalsy();
  });

  it('#fastCheckCollision() returns NoCollision when boundaries are apart', () => {
    const BOUNDARY1 = {
      topLeft: {x: 0, y: 0},
      bottomRight: {x: 10, y: 10},
      center: {x: 5, y: 5},
    };
    const BOUNDARY2 = {
      topLeft: {x: 12, y: 12},
      bottomRight: {x: 20, y: 20},
      center: {x: 16, y: 16},
    };

    expect(CollisionDetection.fastCheckCollision(BOUNDARY1, BOUNDARY2)).toBe(FastCheck.NoCollision);
    expect(CollisionDetection.fastCheckCollision(BOUNDARY2, BOUNDARY1)).toBe(FastCheck.NoCollision);
  });

  it('#fastCheckCollision() works as expected when one boundary is inside the other', () => {
    const BOUNDARY_CONTAINER = {
      topLeft: {x: 0, y: 0},
      bottomRight: {x: 10, y: 10},
      center: {x: 5, y: 5},
    };
    const BOUNDARY_INSIDE = {
      topLeft: {x: 4, y: 3},
      bottomRight: {x: 6, y: 7},
      center: {x: 5, y: 5},
    };

    expect(CollisionDetection.fastCheckCollision(BOUNDARY_INSIDE, BOUNDARY_CONTAINER)).toBe(FastCheck.Collision);
    expect(CollisionDetection.fastCheckCollision(BOUNDARY_CONTAINER, BOUNDARY_INSIDE)).toBe(FastCheck.Uncertain);
  });
});

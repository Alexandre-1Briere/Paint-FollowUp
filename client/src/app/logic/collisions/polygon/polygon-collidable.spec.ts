import { BoundaryBox } from '../utils/boundary-box';
import { PolygonCollidable } from './polygon-collidable';

const HORIZONTAL_AXIS = {x: 1, y: 0};
const VERTICAL_AXIS = {x: 0, y: 1};
const ORIGIN = {x: 0, y: 0};
const DEFAULT_BOUNDARY = BoundaryBox.create([ORIGIN]);

describe('PolygonCollidable', () => {
  it('should create an instance', () => {
    expect(new PolygonCollidable([])).toBeTruthy();
  });

  it('#createRectangle() gives correct rectangle', () => {
    const MIN_VALUE = 5;
    const MAX_VALUE = 55;
    const TOP_LEFT = {x: MIN_VALUE, y: MIN_VALUE};
    const BOTTOM_RIGHT = {x: MAX_VALUE, y: MAX_VALUE};
    const cursor = PolygonCollidable.createRectangle(TOP_LEFT, BOTTOM_RIGHT);

    const horizontalProjection = cursor.getLinearProjection(HORIZONTAL_AXIS);
    expect(horizontalProjection.end - horizontalProjection.start).toBe(MAX_VALUE - MIN_VALUE);
    const verticalProjection = cursor.getLinearProjection(VERTICAL_AXIS);
    expect(verticalProjection.end - verticalProjection.start).toBeLessThanOrEqual(MAX_VALUE - MIN_VALUE);
  });

  it('#createCursor() is not too large', () => {
    const CENTER = {x: 50, y: 50};
    const cursor = PolygonCollidable.createCursor(CENTER);

    const MAXIMUM_PROJECTION_LENGTH = 2;
    const horizontalProjection = cursor.getLinearProjection(HORIZONTAL_AXIS);
    expect(horizontalProjection.end - horizontalProjection.start).toBeLessThanOrEqual(MAXIMUM_PROJECTION_LENGTH);
    const verticalProjection = cursor.getLinearProjection(VERTICAL_AXIS);
    expect(verticalProjection.end - verticalProjection.start).toBeLessThanOrEqual(MAXIMUM_PROJECTION_LENGTH);
  });

  it('#getNormals() is working as expected', () => {
    const TRIANGLE_POINTS = [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0, y: 1},
    ];
    const triangle = new PolygonCollidable(TRIANGLE_POINTS);

    const normals = triangle.getNormals(DEFAULT_BOUNDARY);
    expect(normals[0]).toEqual({x: 0, y: 1});
    expect(normals[1]).toEqual({x: -1, y: -1});
    expect(normals[2]).toEqual({x: 1, y: 0});
  });

  it('#getNormals() returns empty when supplied points are smaller than 3', () => {
    const INCOMPLETE_POLYGON_POINTS = [
      {x: 0, y: 0},
      {x: 1, y: 0},
    ];
    const incompletePolygon = new PolygonCollidable(INCOMPLETE_POLYGON_POINTS);

    expect(incompletePolygon.getNormals(DEFAULT_BOUNDARY).length).toBe(0);
  });

  it('#getLinearProjection() is working as expected', () => {
    const rectangle = PolygonCollidable.createRectangle(
      {x: -1, y: -1},
      {x: 5, y: 5},
    );
    const BOTTOM = 5;
    const linearProjection = rectangle.getLinearProjection(HORIZONTAL_AXIS);
    expect(linearProjection.start).toBe(-1);
    expect(linearProjection.end).toBe(BOTTOM);
  });

  it('#getBoundary() is working as expected', () => {
    const TRIANGLE_POINTS = [
      {x: 0, y: 0},
      {x: 10, y: 0},
      {x: 5, y: 6},
    ];
    const triangle = new PolygonCollidable(TRIANGLE_POINTS);

    const boundary = triangle.getBoundary();
    expect(boundary.topLeft).toEqual({x: 0, y: 0});
    expect(boundary.bottomRight).toEqual({x: 10, y: 6});
    expect(boundary.center).toEqual({x: 5, y: 3});
  });
});

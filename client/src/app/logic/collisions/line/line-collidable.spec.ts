import { BoundaryBox } from '../utils/boundary-box';
import { LineCollidable } from './line-collidable';

const ORIGIN = {x: 0, y: 0};
const DEFAULT_BOUNDARY = BoundaryBox.create([ORIGIN]);
const NO_THICKNESS = 0;

describe('LineCollidable', () => {
  it('should create an instance', () => {
    expect(new LineCollidable(ORIGIN, ORIGIN, NO_THICKNESS)).toBeTruthy();
  });

  it('#getNormals() returns 2 correct normals when thickness is 0', () => {
    const POINT = {x: 1, y: 2};
    const line = new LineCollidable(ORIGIN, POINT, NO_THICKNESS);
    const normals = line.getNormals(DEFAULT_BOUNDARY);

    expect(normals.length).toBe(2);
    expect(normals[0]).toEqual(POINT);
    const PERPENDICULAR = {x: -2, y: 1};
    expect(normals[1]).toEqual(PERPENDICULAR);
  });

  it('#getNormals() returns 2 additional, correct normals when thickness is larger than 0', () => {
    const POINT = {x: 1, y: 2};
    const THICKNESS = 1;
    const line = new LineCollidable(POINT, ORIGIN, THICKNESS);
    const normals = line.getNormals(DEFAULT_BOUNDARY);
    const ORIGIN_INDEX = 3;
    const LENGTH = 4;
    expect(normals.length).toBe(LENGTH);
    const EXPECTED_POINT = {x: -1, y: -2};
    expect(normals[2]).toEqual(EXPECTED_POINT);
    expect(normals[ORIGIN_INDEX]).toEqual(ORIGIN);
  });

  it('#getLinearProjection() works as expected without thickness', () => {
    const AXIS = {x: 1, y: 1};
    const POINT = {x: 1, y: 0};
    const line = new LineCollidable(ORIGIN, POINT, NO_THICKNESS);
    const linearProjection = line.getLinearProjection(AXIS);

    expect(linearProjection.start).toBe(0);
    expect(linearProjection.end).toBe(1);
  });

  it('#getLinearProjection() works as expected with thickness', () => {
    const AXIS = {x: 1, y: 1};
    const POINT = {x: 1, y: 0};
    const THICKNESS = 2;
    const line = new LineCollidable(ORIGIN, POINT, THICKNESS);
    const linearProjection = line.getLinearProjection(AXIS);

    const THICKNESS_PROJECTION_OFFSET = Math.sqrt(2);
    expect(linearProjection.start).toBeCloseTo(-THICKNESS_PROJECTION_OFFSET);
    expect(linearProjection.end).toBeCloseTo(1 + THICKNESS_PROJECTION_OFFSET);
  });
});

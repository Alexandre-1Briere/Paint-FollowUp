import { Projection } from './projection';

const ORIGIN = {x: 0, y: 0};
const X_DIRECTION = {x: 1, y: 0};
const Y_DIRECTION = {x: 0, y: 1};

describe('Projection', () => {
  it('should create an instance', () => {
    expect(new Projection()).toBeTruthy();
  });

  it('#getLinearProjection() works as expected', () => {
    const POINT1 = {x: 3, y: -1};
    const POINT2 = {x: -1, y: 2};

    const horizontalAxis = Projection.getParallelAxis(ORIGIN, X_DIRECTION);
    const projection = Projection.getLinearProjection([POINT1, POINT2], horizontalAxis);

    const EXPECTED_START = -1;
    const EXPECTED_END = 3;
    expect(projection.start).toBe(EXPECTED_START);
    expect(projection.end).toBe(EXPECTED_END);
  });

  it('#getLinearProjection() returns negative value when no points are supplied', () => {
    const horizontalAxis = Projection.getParallelAxis(ORIGIN, X_DIRECTION);
    const projection = Projection.getLinearProjection([], horizontalAxis);

    const EXPECTED_UNDEFINED_VALUE = -1000000;
    expect(projection.start).toBe(EXPECTED_UNDEFINED_VALUE);
    expect(projection.end).toBe(EXPECTED_UNDEFINED_VALUE);
  });

  it('#getLinearProjectionContaining() works as expected', () => {
    const PROJECTIONS = [
      {start: 0, end: 1},
      {start: -1, end: 0},
      {start: 0, end: 2},
    ];
    const projection = Projection.getLinearProjectionContaining(PROJECTIONS);
    expect(projection.start).toBe(-1);
    expect(projection.end).toBe(2);
  });

  it('#getLinearProjectionContaining() returns range [0,0] when array is empty', () => {
    const projection = Projection.getLinearProjectionContaining([]);
    expect(projection.start).toBe(0);
    expect(projection.end).toBe(0);
  });

  it('#overlapping() returns false when projections do not intersect', () => {
    const PROJECTION1 = {start: -5, end: -1};
    const PROJECTION2 = {start: 1, end: 2};

    expect(Projection.overlapping(PROJECTION1, PROJECTION2)).toBeFalsy();
    expect(Projection.overlapping(PROJECTION2, PROJECTION1)).toBeFalsy();
  });

  it('#overlapping() returns true when projections do partially intersect', () => {
    const PROJECTION1 = {start: -5, end: -1};
    const PROJECTION2 = {start: -2, end: 2};

    expect(Projection.overlapping(PROJECTION1, PROJECTION2)).toBeTruthy();
    expect(Projection.overlapping(PROJECTION2, PROJECTION1)).toBeTruthy();
  });

  it('#overlapping() returns true when one projection is inside the other', () => {
    const PROJECTION1 = {start: -5, end: 1};
    const PROJECTION2 = {start: -1, end: 0};

    expect(Projection.overlapping(PROJECTION1, PROJECTION2)).toBeTruthy();
    expect(Projection.overlapping(PROJECTION2, PROJECTION1)).toBeTruthy();
  });

  it('#getScaleFromPoints() works as expected', () => {
    expect(Projection.getScaleFromPoints({x: 0, y: 0}, {x: 1, y: 0}, {x: -1, y: 0})).toBe(-1);
    expect(Projection.getScaleFromPoints({x: 0, y: 0}, {x: 10, y: 10}, {x: 5, y: 5})).toBe(1 / 2);
    expect(Projection.getScaleFromPoints({x: 0, y: 0}, {x: 0, y: 0}, {x: 1, y: 1})).toBe(0);
  });

  it('#getNormalAxis() works as expected', () => {
    const axis = Projection.getNormalAxis(X_DIRECTION, Y_DIRECTION);

    const EXPECTED_X = -1;
    const EXPECTED_Y = -1;
    expect(axis.x).toBe(EXPECTED_X);
    expect(axis.y).toBe(EXPECTED_Y);
  });
});

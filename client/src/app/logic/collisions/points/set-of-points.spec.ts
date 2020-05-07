import { SetOfPoints } from './set-of-points';

const DEFAULT_THICKNESS = 2;

describe('SetOfPoints', () => {
  it('should create an instance', () => {
    expect(new SetOfPoints([], DEFAULT_THICKNESS)).toBeTruthy();
  });

  it('#getCollidable() returns correct number of LineCollidable', () => {
    const POINTS = [
      {x: -1, y: -1},
      {x: 1, y: 1},
      {x: 2, y: 2},
    ];
    expect(new SetOfPoints(POINTS, DEFAULT_THICKNESS).getCollidables().length).toEqual(2);
  });

  it('#getCollidable() returns circle collidable when there is only 1 point', () => {
    const POINTS = [
      {x: 10, y: 1},
    ];
    const collidables = new SetOfPoints(POINTS, DEFAULT_THICKNESS).getCollidables();
    expect(collidables.length).toEqual(1);
    const horizontalProjection = collidables[0].getLinearProjection({x: 1, y: 0});
    expect(horizontalProjection).toEqual({start: 9, end: 11});
    const verticalProjection = collidables[0].getLinearProjection({x: 0, y: 1});
    expect(verticalProjection).toEqual({start: 0, end: 2});
  });

  it('#getNegativeCollidable() returns empty array', () => {
    expect(new SetOfPoints([], DEFAULT_THICKNESS).getNegativeCollidables()).toEqual([]);
  });

  it('#getBoundary() is working as expected', () => {
    const POINTS = [
      {x: 1, y: 1},
      {x: -1, y: 3},
      {x: 3, y: -1},
    ];
    const setOfPoints = new SetOfPoints(POINTS, DEFAULT_THICKNESS);
    const boundary = setOfPoints.getBoundary();
    const HALF_THICKNESS = DEFAULT_THICKNESS / 2;
    const DEFAULT = 3;
    expect(boundary.topLeft).toEqual({x: -1 - HALF_THICKNESS, y: -1 - HALF_THICKNESS});
    expect(boundary.bottomRight).toEqual({x: DEFAULT + HALF_THICKNESS, y: DEFAULT + HALF_THICKNESS});
    expect(boundary.center).toEqual({x: 1, y: 1});
  });
});

import { SvgUtils } from './svg-utils';

describe('SvgUtils', () => {
  it('should create an instance', () => {
    expect(new SvgUtils()).toBeTruthy();
  });

  it('#isHexColorValid() returns true with valid input', () => {
    expect(SvgUtils.isHexColorValid('#012345')).toBeTruthy();
    expect(SvgUtils.isHexColorValid('#6789ab')).toBeTruthy();
    expect(SvgUtils.isHexColorValid('#cdef01')).toBeTruthy();
  });

  it('#isHexColorValid() returns false when # is missing', () => {
    expect(SvgUtils.isHexColorValid('012345')).toBeFalsy();
    expect(SvgUtils.isHexColorValid('6789abc')).toBeFalsy();
  });

  it('#isHexColorValid() returns false when length is wrong', () => {
    expect(SvgUtils.isHexColorValid('#01234')).toBeFalsy();
    expect(SvgUtils.isHexColorValid('#6789abc')).toBeFalsy();
  });

  it('#isHexColorValid() returns false when with erroneous characters', () => {
    expect(SvgUtils.isHexColorValid('##55555')).toBeFalsy();
    expect(SvgUtils.isHexColorValid('#0!2345')).toBeFalsy();
    expect(SvgUtils.isHexColorValid('#6789ag')).toBeFalsy();
  });

  it('#translateAll() is working as expected', () => {
    const points = [
      {x: 0, y: 1},
      {x: -5, y: 10},
    ];
    const pointsInit = [
      {x: 0, y: 1},
      {x: -5, y: 10},
    ];
    const DX = 20;
    const DY = 10;
    SvgUtils.translateAll({x: DX, y: DY}, points);
    expect(points[0]).toEqual({x: DX, y: 1 + DY});
    expect(points[1]).toEqual({x: pointsInit[1].x + DX, y: pointsInit[1].y + DY});
  });

  it('#rotateClockWise() works as expected', () => {
    const POINTS = [
      {x: 10, y: 0},
      {x: -10, y: 0},
    ];
    const QUARTER_TURN = 90;

    const round = (): void => {
      POINTS[0].x = Math.round(POINTS[0].x);
      POINTS[0].y = Math.round(POINTS[0].y);
      POINTS[1].x = Math.round(POINTS[1].x);
      POINTS[1].y = Math.round(POINTS[1].y);
      POINTS[0].x += 0; // Because -0 is not equal to 0 in jasmine
      POINTS[0].y += 0;
      POINTS[1].x += 0;
      POINTS[1].y += 0;
    };

    SvgUtils.rotateClockWise(QUARTER_TURN, {x: 0, y: 0}, POINTS);
    const EXPECTED_FIRST_ROTATION_RESULT = [
      {x: 0, y: 10},
      {x: 0, y: -10},
    ];
    round();
    expect(POINTS).toEqual(EXPECTED_FIRST_ROTATION_RESULT);

    SvgUtils.rotateClockWise(QUARTER_TURN, {x: 0, y: 0}, POINTS);
    const EXPECTED_SECOND_ROTATION_RESULT = [
      {x: -10, y: 0},
      {x: 10, y: 0},
    ];
    round();
    expect(POINTS).toEqual(EXPECTED_SECOND_ROTATION_RESULT);
  });

  it('#scalePoints() works as expected', () => {
    const POINTS = [
      {x: -10, y: -10},
      {x: 10, y: 10},
    ];

    SvgUtils.scalePoints(POINTS, {x: 0, y: 10}, 2, {x: 1, y: 0});
    expect(POINTS).toEqual([{x: -20, y: -10}, {x: 20, y: 10}]);

    SvgUtils.scalePoints(POINTS, {x: 0, y: -10}, -1, {x: 1, y: 0});
    expect(POINTS).toEqual([{x: 20, y: -10}, {x: -20, y: 10}]);

    SvgUtils.scalePoints(POINTS, {x: -10, y: 0}, -1, {x: 0, y: 1});
    expect(POINTS).toEqual([{x: 20, y: 10}, {x: -20, y: -10}]);
  });

  it('#scalePointsWithThickness() works as expected', () => {
    const POINTS = [
      {x: -10, y: -10},
      {x: 10, y: 10},
    ];
    const THICKNESS = 20;

    let thickness = SvgUtils.scalePointsWithThickness(THICKNESS, POINTS, 2, {x: 1, y: 0});
    expect(POINTS).toEqual([{x: -30, y: -10}, {x: 30, y: 10}]);

    thickness = SvgUtils.scalePointsWithThickness(thickness, POINTS, -1, {x: 1, y: 0});
    expect(POINTS).toEqual([{x: 30, y: -10}, {x: -30, y: 10}]);

    thickness = SvgUtils.scalePointsWithThickness(thickness, POINTS, -1 / 2, {x: 0, y: 1});
    expect(POINTS).toEqual([{x: 35, y: 5}, {x: -35, y: -5}]);

    const EXPECTED_NEW_THICKNESS = 10;
    expect(thickness).toBe(EXPECTED_NEW_THICKNESS);
  });

  it('#scalePointsWithThickness() works when center of points is not center of projection', () => {
    const POINTS = [
      {x: -10, y: -10},
      {x: -10, y: 10},
      {x: 20, y: 0},
    ];
    const THICKNESS = 20;

    const thickness = SvgUtils.scalePointsWithThickness(THICKNESS, POINTS, 2, {x: 1, y: 0});
    POINTS[0].x = Math.round(POINTS[0].x);
    POINTS[1].x = Math.round(POINTS[1].x);
    expect(POINTS).toEqual([{x: -30, y: -10}, {x: -30, y: 10}, {x: 50, y: 0}]);
    expect(thickness).toBe(THICKNESS);
  });

  it('#getCenter() returns correct value', () => {
    const POINTS = [
      {x: 0, y: 0},
      {x: 3, y: 0},
      {x: 0, y: 3},
    ];
    expect(SvgUtils.getCenter(POINTS)).toEqual({x: 1, y: 1});
  });

  it('#getCenter() returns 0 by default when there is no points', () => {
    expect(SvgUtils.getCenter([])).toEqual({x: 0, y: 0});
  });

  it('#radiansToDegrees() and degreesToRadians() work as expected', () => {
    expect(SvgUtils.degreesToRadians(SvgUtils.radiansToDegrees(2))).toBeCloseTo(2);
  });
});

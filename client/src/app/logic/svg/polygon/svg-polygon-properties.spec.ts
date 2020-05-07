import { TestSpeedUpgrader } from '../../../testHelpers/test-speed-upgrader.spec';
import { SvgPolygonProperties } from './svg-polygon-properties';

const POINTS = 'points';
const RAW_SVG_POINTS = 'rawSvgPoints';
const DISPLAY_OUTLINE_THICKNESS = 'displayOutlineThickness';
const TARGET_OUTLINE_THICKNESS = 'targetOutlineThickness';

const ADJUST_DISPLAY_OUTLINE_THICKNESS = 'adjustDisplayOutlineThickness';
const REFRESH_RAW_PATH = 'refreshRawSvgPoints';
const FIND_REGULAR_POLYGON_SCALE = 'findRegularPolygonScale';

describe('svgPolygonProperties', () => {
  let svgPolygonProperties: SvgPolygonProperties;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(() => {
    svgPolygonProperties = new SvgPolygonProperties();
  });

  it('should create an instance', () => {
    expect(svgPolygonProperties).toBeTruthy();
  });

  it('#translate() works as expected', () => {
    svgPolygonProperties[POINTS] = [
      {x: 0, y: 0},
      {x: 3, y: 0},
      {x: 0, y: 3},
    ];
    const DISTANCE = 20;
    svgPolygonProperties.translate({x: DISTANCE, y: -1 * DISTANCE});
    expect(svgPolygonProperties[POINTS][0]).toEqual({x: 20, y: -20});
    expect(svgPolygonProperties[POINTS][1]).toEqual({x: 23, y: -20});
    expect(svgPolygonProperties[POINTS][2]).toEqual({x: 20, y: -17});
  });

  it('#rotateClockWise() works as expected', () => {
    svgPolygonProperties[POINTS] = [
      {x: 0, y: 0},
      {x: 3, y: 0},
      {x: 0, y: 3},
    ];
    const QUARTER_TURN = 90;
    svgPolygonProperties.rotateClockwise(QUARTER_TURN);
    const boundary = svgPolygonProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: -1, y: 0});
    expect(boundary.bottomRight).toEqual({x: 2, y: 3});
  });

  it('#scale() works as expected', () => {
    svgPolygonProperties[POINTS] = [
      {x: 0, y: 0},
      {x: 3, y: 0},
      {x: 0, y: 3},
    ];
    svgPolygonProperties.scale(2, {x: 1, y: 0});
    let boundary = svgPolygonProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: -1, y: 0});
    expect(boundary.bottomRight).toEqual({x: 5, y: 3});

    svgPolygonProperties.scale(-1 / 2, {x: 0, y: 1});
    boundary = svgPolygonProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: -1, y: 0});
    expect(boundary.bottomRight).toEqual({x: 5, y: 1.5});
  });

  it('#createRegularPolygonFromMouse() works as expected in bottom-right quadrant', () => {
    const SIDE = 3;
    const RADIUS = 50;
    svgPolygonProperties.createRegularPolygonFromMouse(SIDE, {x: 50, y: 50}, {x: 80, y: 100});
    const boundary = svgPolygonProperties.getBoundary();
    expect(boundary.bottomRight.x).toBeCloseTo(RADIUS + RADIUS / Math.cos(Math.PI / (2 * SIDE)));
    expect(boundary.bottomRight.y).toBeCloseTo(2 * RADIUS);
  });

  it('#createRegularPolygonFromMouse() works as expected in bottom-left quadrant', () => {
    const SIDE = 3;
    const RADIUS = 50;
    svgPolygonProperties.createRegularPolygonFromMouse(SIDE, {x: 50, y: 50}, {x: 0, y: 70});
    const boundary = svgPolygonProperties.getBoundary();
    expect(boundary.topLeft.x).toBeCloseTo(0);
    expect(boundary.bottomRight.y).toBeCloseTo(RADIUS + RADIUS * Math.cos(Math.PI / (2 * SIDE)));
  });

  it('#createRegularPolygonFromMouse() works as expected in top-left quadrant', () => {
    const SIDE = 3;
    const RADIUS = 50;
    svgPolygonProperties.createRegularPolygonFromMouse(SIDE, {x: 50, y: 50}, {x: 30, y: 0});
    const boundary = svgPolygonProperties.getBoundary();
    expect(boundary.topLeft.x).toBeCloseTo(RADIUS - RADIUS / Math.cos(Math.PI / (2 * SIDE)));
    expect(boundary.topLeft.y).toBeCloseTo(0);
  });

  it('#createRegularPolygonFromMouse() works as expected in top-right quadrant', () => {
    const SIDE = 3;
    const RADIUS = 50;
    svgPolygonProperties.createRegularPolygonFromMouse(SIDE, {x: 50, y: 50}, {x: 100, y: 40});
    const boundary = svgPolygonProperties.getBoundary();
    expect(boundary.bottomRight.x).toBeCloseTo(2 * RADIUS);
    expect(boundary.topLeft.y).toBeCloseTo(RADIUS - RADIUS * Math.cos(Math.PI / (2 * SIDE)));
  });

  it('#createRegularPolygonFromMouse() works even when there is no movement', () => {
    const SIDE = 3;
    const RADIUS = 50;
    svgPolygonProperties.createRegularPolygonFromMouse(SIDE, {x: 50, y: 50}, {x: 50, y: 50});
    expect(svgPolygonProperties[POINTS].length).toBe(SIDE);
    const boundary = svgPolygonProperties.getBoundary();
    expect(boundary.center.x + boundary.bottomRight.x - boundary.topLeft.x).toBeCloseTo(RADIUS);
    expect(boundary.center.y + boundary.bottomRight.y - boundary.topLeft.y).toBeCloseTo(RADIUS);
  });

  it('#findRegularPolygonScale() returns 0 when points do not form polygon', () => {
    const scale = svgPolygonProperties[FIND_REGULAR_POLYGON_SCALE]([], {x: 0, y: 0}, {x: 10, y: 10});
    expect(scale).toBe(0);
  });

  it('#findRegularPolygonScale() returns 0 when points are identicals', () => {
    const scale = svgPolygonProperties[FIND_REGULAR_POLYGON_SCALE](
      [{x: 0, y: 0}, {x: 0, y: 0}, {x: 0, y: 0}],
      {x: 0, y: 0},
      {x: 10, y: 10},
    );
    expect(scale).toBe(0);
  });

  it('#getCenter().x returns correct value', () => {
    svgPolygonProperties[POINTS] = [
      {x: 0, y: 0},
      {x: 3, y: 0},
      {x: 0, y: 3},
    ];
    expect(svgPolygonProperties.getCenter().x).toBe(1);
  });

  it('#getCenter().x returns 0 by default when there is no points', () => {
    expect(svgPolygonProperties.getCenter().x).toBe(0);
  });

  it('#getCenter().y returns correct value', () => {
    svgPolygonProperties[POINTS] = [
      {x: 0, y: 0},
      {x: -3, y: 0},
      {x: 0, y: -3},
    ];
    expect(svgPolygonProperties.getCenter().y).toBe(-1);
  });

  it('#getCenter().y returns 0 by default when there is no points', () => {
    expect(svgPolygonProperties.getCenter().y).toBe(0);
  });

  it('#refreshRawPath() should add new points in the rawSvgPoints', () => {
    svgPolygonProperties[POINTS] = [
      {x: 0, y: 0},
      {x: 10, y: 10},
      {x: 8, y: -3},
    ];
    svgPolygonProperties.setOutlineThickness(0);
    svgPolygonProperties[REFRESH_RAW_PATH]();
    expect(svgPolygonProperties[RAW_SVG_POINTS]).toBe('0 0 10 10 8 -3 ');
  });

  it('#setOutlineThickness() sets thickness properly when polygon has no points', () => {
    const TARGET_TICKNESS = 10;
    svgPolygonProperties.setOutlineThickness(TARGET_TICKNESS);
    expect(svgPolygonProperties[TARGET_OUTLINE_THICKNESS]).toBe(TARGET_TICKNESS);
    expect(svgPolygonProperties[DISPLAY_OUTLINE_THICKNESS]).toBe(0);
  });

  it('#setOutlineThickness() sets thickness properly when polygon has points', () => {
    const TARGET_TICKNESS = 10;
    svgPolygonProperties[POINTS] = [
      {x: 0, y: 0},
      {x: 10, y: 0},
      {x: 10, y: 10},
      {x: 0, y: 10},
    ];
    svgPolygonProperties.setOutlineThickness(TARGET_TICKNESS);
    expect(svgPolygonProperties[TARGET_OUTLINE_THICKNESS]).toBe(TARGET_TICKNESS);
    expect(svgPolygonProperties[DISPLAY_OUTLINE_THICKNESS]).toBe(TARGET_TICKNESS / 2);
  });

  it('#setOutlineThickness() does nothing when negative thickness is supplied', () => {
    const originalThickness = svgPolygonProperties[TARGET_OUTLINE_THICKNESS];
    const originalDisplayThickness = svgPolygonProperties[DISPLAY_OUTLINE_THICKNESS];
    svgPolygonProperties.setOutlineThickness(-1);
    expect(svgPolygonProperties[TARGET_OUTLINE_THICKNESS]).toBe(originalThickness);
    expect(svgPolygonProperties[DISPLAY_OUTLINE_THICKNESS]).toBe(originalDisplayThickness);
  });

  it('#adjustDisplayOutlineThickness should update displayOutlineThickness', () => {
    const outlineThicknessLimit = Math.max(svgPolygonProperties.width / 2,
        svgPolygonProperties.height / 2);
    const EXPECTED_THICKNESS_NUMBER = Math.min(svgPolygonProperties[TARGET_OUTLINE_THICKNESS],
        outlineThicknessLimit);
    svgPolygonProperties[DISPLAY_OUTLINE_THICKNESS] = EXPECTED_THICKNESS_NUMBER;
    svgPolygonProperties[ADJUST_DISPLAY_OUTLINE_THICKNESS]();
    expect(svgPolygonProperties[DISPLAY_OUTLINE_THICKNESS]).toEqual(EXPECTED_THICKNESS_NUMBER);
  });

  it('#getCollidables() returns correct value', () => {
    svgPolygonProperties[POINTS] = [
      {x: 0, y: 0},
      {x: 100, y: 0},
      {x: 100, y: 100},
      {x: 0, y: 100},
    ];

    const collidables = svgPolygonProperties.getCollidables();
    expect(collidables.length).toBe(1);
    const horizontalProjection = collidables[0].getLinearProjection({x: 1, y: 0});
    expect(horizontalProjection).toEqual({start: 0, end: 100});
    const verticalProjection = collidables[0].getLinearProjection({x: 0, y: 1});
    expect(verticalProjection).toEqual({start: 0, end: 100});
  });

  it('#getNegativeCollidables() returns [] when displayFill=true', () => {
    svgPolygonProperties[POINTS] = [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 1, y: 0},
    ];
    svgPolygonProperties.displayFill = true;
    expect(svgPolygonProperties.getNegativeCollidables()).toEqual([]);
  });

  it('#getNegativeCollidables() returns correct value when displayFill=false', () => {
    svgPolygonProperties[POINTS] = [
      {x: 0, y: 0},
      {x: 100, y: 0},
      {x: 100, y: 100},
      {x: 0, y: 100},
    ];
    svgPolygonProperties.displayFill = false;
    const THICKNESS = 10;
    svgPolygonProperties.setOutlineThickness(THICKNESS);

    const negativeCollidables = svgPolygonProperties.getNegativeCollidables();
    expect(negativeCollidables.length).toBe(1);
    const horizontalProjection = negativeCollidables[0].getLinearProjection({x: 1, y: 0});
    expect(horizontalProjection).toEqual({start: 10, end: 90});
    const verticalProjection = negativeCollidables[0].getLinearProjection({x: 0, y: 1});
    expect(verticalProjection).toEqual({start: 10, end: 90});
  });

  it('#getBoundary() has correct values', () => {
    svgPolygonProperties[POINTS] = [
      {x: 0, y: 0},
      {x: 100, y: 0},
      {x: 100, y: 100},
      {x: 0, y: 100},
    ];
    const boundary = svgPolygonProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: 0, y: 0});
    expect(boundary.bottomRight).toEqual({x: 100, y: 100});
  });
});

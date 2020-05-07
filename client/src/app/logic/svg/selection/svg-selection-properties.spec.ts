import { TestSpeedUpgrader } from '../../../testHelpers/test-speed-upgrader.spec';
import { PolygonCollidable } from '../../collisions/polygon/polygon-collidable';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import {SvgRectangleProperties} from '../rectangle/svg-rectangle-properties';
import { SvgSelectionProperties } from './svg-selection-properties';

class SvgSelectionTestable extends SvgSelectionProperties {
  constructor() {super(); }
  getX(): number {return this.x; }
  getY(): number {return this.y; }
}

describe('svgSelectionProperties', () => {
  let svgSelectionProperties: SvgSelectionTestable;

  TestSpeedUpgrader.overWriteModuleResetForSpeedGain();

  beforeEach(() => {
    svgSelectionProperties = new SvgSelectionTestable();
  });

  it('should create an instance', () => {
    expect(new SvgSelectionTestable()).toBeTruthy();
  });

  it('#centerAt() works as expected', () => {
    const CENTER = {x: 40, y: 50};
    svgSelectionProperties.centerAt(CENTER);
    expect(svgSelectionProperties.getCenter()).toEqual(CENTER);
  });

  it('#getCenter() works as expected', () => {
    const POINTS = 'points';
    const LOCATION = 55;
    for (const point of svgSelectionProperties[POINTS]) {
      point.x = LOCATION;
      point.y = LOCATION;
    }
    expect(svgSelectionProperties.getCenter()).toEqual({x: LOCATION, y: LOCATION});
  });

  it('#rotateClockwise() works as expected', () => {
    const QUARTER_TURN = 90;
    svgSelectionProperties.fitExactlyInside(-1, 0, 1, 1);
    svgSelectionProperties.rotateClockwise(QUARTER_TURN);
    const boundary = svgSelectionProperties.getBoundary();
    expect({x: Math.round(2 * boundary.topLeft.x) / 2, y: boundary.topLeft.y}).toEqual({x: -0.5, y: -0.5});
    expect({x: Math.round(2 * boundary.bottomRight.x) / 2, y: boundary.bottomRight.y}).toEqual({x: 0.5, y: 1.5});
  });

  it('#fitExactlyInside should compute Quadrant ', () => {
    const X1 = 1;
    const Y1 = 2;
    const X2 = 3;
    const Y2 = 4;
    svgSelectionProperties.fitExactlyInside(X1, Y1, X2, Y2);
    const boundary = svgSelectionProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: X1, y: Y1});
    expect(boundary.bottomRight).toEqual({x: X2, y: Y2});
  });

  it('#fitAroundComponentsWithoutChangingAngle works as expected', () => {
    const SIZE = 10;

    const rectangle = new SvgRectangleProperties();
    rectangle.fitExactlyInside(0, 0, SIZE, SIZE);
    const ANGLE = 45;
    rectangle.rotateClockwise(ANGLE);

    svgSelectionProperties.fitAroundComponentsWithoutChangingAngle([rectangle]);
    const boundary = svgSelectionProperties.getBoundary();

    const expectedStart = SIZE / 2 - (Math.sqrt(2) * SIZE / 2);
    const expectedEnd = SIZE / 2 + (Math.sqrt(2) * SIZE / 2);
    expect(boundary.topLeft.x).toBeCloseTo(expectedStart);
    expect(boundary.topLeft.y).toBeCloseTo(expectedStart);
    expect(boundary.bottomRight.x).toBeCloseTo(expectedEnd);
    expect(boundary.bottomRight.y).toBeCloseTo(expectedEnd);
  });

  it('#fitAroundComponentsWithoutChangingAngle does nothing when array is empty', () => {
    svgSelectionProperties.fitExactlyInside(0, 0, 2, 1);

    svgSelectionProperties.fitAroundComponentsWithoutChangingAngle([]);
    const boundary = svgSelectionProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: 0, y: 0});
    expect(boundary.bottomRight).toEqual({x: 2, y: 1});
  });

  it('#tryToMoveControlPoint works as expected', () => {
    const SIZE = 50;
    svgSelectionProperties.fitExactlyInside(0, 0, SIZE, SIZE);
    svgSelectionProperties.displayControlPoints = true;
    svgSelectionProperties.tryToGrabControlPoint({x: SIZE, y: SIZE / 2});

    const SHOULD_NOT_MATTER = -1000;
    const selectionScale = svgSelectionProperties.tryToMoveControlPoint({x: SIZE / 2, y: SHOULD_NOT_MATTER});
    expect(selectionScale).toEqual({
      success: true,
      fixedPoint: {x: 0, y: SIZE / 2},
      grabbedPoint: {x: SIZE, y: SIZE / 2},
      movedGrabbedPoint: {x: SIZE / 2, y: SIZE / 2},
    });

    const boundary = svgSelectionProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: 0, y: 0});
    expect(boundary.bottomRight).toEqual({x: SIZE / 2, y: SIZE});
  });

  it('#tryToMoveControlPoint works multiple times in a row', () => {
    const SIZE = 50;
    svgSelectionProperties.fitExactlyInside(0, 0, SIZE, SIZE);
    svgSelectionProperties.displayControlPoints = true;
    svgSelectionProperties.tryToGrabControlPoint({x: SIZE / 2, y: SIZE});

    const SHOULD_NOT_MATTER = 1000;
    let selectionScale = svgSelectionProperties.tryToMoveControlPoint({x: SHOULD_NOT_MATTER, y:  SIZE / 2});
    expect(selectionScale).toEqual({
      success: true,
      fixedPoint: {x: SIZE / 2, y: 0},
      grabbedPoint: {x: SIZE / 2, y: SIZE},
      movedGrabbedPoint: {x: SIZE / 2, y: SIZE / 2},
    });

    svgSelectionProperties.releaseGrab();
    const EXPECTED_Y_CENTER = SIZE / (2 + 2);
    svgSelectionProperties.tryToGrabControlPoint({x: 0, y: EXPECTED_Y_CENTER });
    selectionScale = svgSelectionProperties.tryToMoveControlPoint({x: SIZE - 2, y: SHOULD_NOT_MATTER});
    expect(selectionScale).toEqual({
      success: true,
      fixedPoint: {x: SIZE, y: EXPECTED_Y_CENTER},
      grabbedPoint: {x: 0, y: EXPECTED_Y_CENTER},
      movedGrabbedPoint: {x: SIZE - 2, y: EXPECTED_Y_CENTER},
    });

    const boundary = svgSelectionProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: SIZE - 2, y: 0});
    expect(boundary.bottomRight).toEqual({x: SIZE, y: SIZE / 2});
  });

  it('#tryToMoveControlPoint is not successful when no control point is grabbed', () => {
    const SIZE = 50;
    svgSelectionProperties.fitExactlyInside(0, 0, SIZE, SIZE);

    const selectionScale = svgSelectionProperties.tryToMoveControlPoint({x: 1, y: 1});
    expect(selectionScale).toEqual({
      success: false,
      fixedPoint: {x: 0, y: 0},
      grabbedPoint: {x: 0, y: 0},
      movedGrabbedPoint: {x: 0, y: 0},
    });

    const boundary = svgSelectionProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: 0, y: 0});
    expect(boundary.bottomRight).toEqual({x: SIZE, y: SIZE});
  });

  it('#tryToMoveControlPoint is not successful selection has no area', () => {
    svgSelectionProperties.fitExactlyInside(0, 0, 0, 0);

    svgSelectionProperties.tryToGrabControlPoint({x: 0, y: 0});
    const TRY_TO_STRECH = 1000;
    const selectionScale = svgSelectionProperties.tryToMoveControlPoint({x: TRY_TO_STRECH, y: TRY_TO_STRECH});
    expect(selectionScale).toEqual({
      success: false,
      fixedPoint: {x: 0, y: 0},
      grabbedPoint: {x: 0, y: 0},
      movedGrabbedPoint: {x: 0, y: 0},
    });

    const boundary = svgSelectionProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: 0, y: 0});
    expect(boundary.bottomRight).toEqual({x: 0, y: 0});
  });

  it('#tryToGrabControlPoint works as expected', () => {
    const SIZE = 50;
    svgSelectionProperties.fitExactlyInside(0, 0, SIZE, SIZE);
    svgSelectionProperties.displayControlPoints = true;

    expect(
      svgSelectionProperties.tryToGrabControlPoint({x: SIZE / 2, y: 0}) &&
      svgSelectionProperties.tryToGrabControlPoint({x: SIZE, y: SIZE / 2}) &&
      svgSelectionProperties.tryToGrabControlPoint({x: SIZE / 2, y: SIZE}) &&
      svgSelectionProperties.tryToGrabControlPoint({x: 0, y: SIZE / 2})
    ).toBeTruthy();

    expect(
      svgSelectionProperties.tryToGrabControlPoint({x: 0, y: 0}) ||
      svgSelectionProperties.tryToGrabControlPoint({x: SIZE, y: 0}) ||
      svgSelectionProperties.tryToGrabControlPoint({x: SIZE, y: SIZE}) ||
      svgSelectionProperties.tryToGrabControlPoint({x: 0, y: SIZE})
    ).toBeFalsy();
  });

  it('#tryToGrabControlPoint returns false when displayControlPoints = false', () => {
    const SIZE = 50;
    svgSelectionProperties.fitExactlyInside(0, 0, SIZE, SIZE);
    svgSelectionProperties.displayControlPoints = false;

    expect(
      svgSelectionProperties.tryToGrabControlPoint({x: SIZE / 2, y: 0}) ||
      svgSelectionProperties.tryToGrabControlPoint({x: SIZE, y: SIZE / 2}) ||
      svgSelectionProperties.tryToGrabControlPoint({x: SIZE / 2, y: SIZE}) ||
      svgSelectionProperties.tryToGrabControlPoint({x: 0, y: SIZE / 2})
    ).toBeFalsy();
  });

  /*code inspiré de https://stackoverflow.com/questions/38980689/how-to-test-for-model-type-in-angular-2-jasmine*/
  it('#getCollidables should return Collidable[]', () => {
    const items = svgSelectionProperties.getCollidables();
    items.forEach((item) => {
      expect(item instanceof PolygonCollidable).toBe(true,
          'instance of PolygonCollidable');
    });
  });

  it ('#getBoundary should call create correct method', () => {
    // tslint:disable-next-line:no-any
    const getBoundarySpy = spyOn<any>(BoundaryBox, 'create');
    svgSelectionProperties.getBoundary();
    expect(getBoundarySpy).toHaveBeenCalled();
  });

});

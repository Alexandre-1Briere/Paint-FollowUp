import { Point } from '../../../interfaces/point';
import { CircleCollidable } from '../../collisions/circle/circle-collidable';
import {LineCollidable} from '../../collisions/line/line-collidable';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import { SvgUtils } from '../utils/svg-utils';
import { SvgPolylineProperties } from './svg-polyline-properties';

class SvgPolyLineTestable extends SvgPolylineProperties {
  constructor() { super(); }
  howManyPoints(): number { return this.points.length; }
  rawSvgPointsLength(): number { return this.rawSvgPoints.length; }
  getPoint(): Point[] { return this.points; }
  getRawSvgPoints(): string { return this.rawSvgPoints; }
  setRawSvgPoints( rawSvgPoint: string): void { this.rawSvgPoints = rawSvgPoint; }
  testPointString(point: Point): string { return this.pointString(point); }
  setPoint(point: Point[] ): void { this.points = point; }
  testRefreshRawSvgPoint(): void { return this.refreshRawSvgPoints(); }
}

// tslint:disable:no-any
// Reason: allow spyOn<any>
describe('SvgPolylineProperties', () => {
  let svgPolylineProperties: SvgPolyLineTestable;

  beforeEach(() => {
    svgPolylineProperties = new SvgPolyLineTestable();
  });

  it('should create an instance', () => {
    expect(new SvgPolylineProperties()).toBeTruthy();
  });

  it('#getCenter() works as expected', () => {
    svgPolylineProperties.addPoint(0, 0);
    svgPolylineProperties.addPoint(2, 2);
    expect(svgPolylineProperties.getCenter()).toEqual({x: 1, y: 1});
  });

  it('#translate() should call translateAll and refreshRawSvgPoint', () => {
    const refreshRawSvgPointsSpy = spyOn<any>(svgPolylineProperties, 'refreshRawSvgPoints');
    const translateAllSpy = spyOn<any>(SvgUtils, 'translateAll');
    svgPolylineProperties.translate({x: 2, y: 6});
    expect(refreshRawSvgPointsSpy).toHaveBeenCalled();
    expect(translateAllSpy).toHaveBeenCalled();
  });

  it('#rotateClockWise() works as expected', () => {
    const QUARTER_TURN = 90;
    svgPolylineProperties.addPoint(-1, 0);
    svgPolylineProperties.addPoint(1, 0);
    svgPolylineProperties.setThickness(2);
    svgPolylineProperties.rotateClockwise(QUARTER_TURN);

    const boundary = svgPolylineProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: -1, y: -2});
    expect(boundary.bottomRight).toEqual({x: 1, y: 2});
  });

  it('#scale() works as expected', () => {
    svgPolylineProperties.addPoint(-1, -1 / 2);
    svgPolylineProperties.addPoint(1, 1 / 2);
    svgPolylineProperties.setThickness(2);
    svgPolylineProperties.scale(2, {x: 0, y: 1});

    const boundary = svgPolylineProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: -2, y: -3});
    expect(boundary.bottomRight).toEqual({x: 2, y: 3});
  });

  it('#addPoint() appends rawSvgPoints correctly', () => {
    const X = -2;
    const Y = 1;
    svgPolylineProperties.addPoint(X, Y);

    const EXPECTED_NUMBER_POINTS = 1;
    const EXPECTED_LENGTH = 5;
    expect(svgPolylineProperties.howManyPoints()).toEqual(EXPECTED_NUMBER_POINTS);
    expect(svgPolylineProperties.rawSvgPointsLength()).toEqual(EXPECTED_LENGTH);
  });

  it('#changeLastPoint() works as expected', () => {
    const INITIAL_X = 2;
    const INITIAL_Y = 1;
    svgPolylineProperties.addPoint(INITIAL_X, INITIAL_Y);

    const NEW_X = 22;
    const NEW_Y = 11;
    svgPolylineProperties.changeLastPoint(NEW_X, NEW_Y);

    const EXPECTED_NUMBER_POINTS = 1;
    const EXPECTED_LENGTH = 6;
    expect(svgPolylineProperties.howManyPoints()).toEqual(EXPECTED_NUMBER_POINTS);
    expect(svgPolylineProperties.rawSvgPointsLength()).toEqual(EXPECTED_LENGTH);
  });

  it('#changeLastPoint() does nothing if no point has been added', () => {
    const USELESS_X = 2;
    const USELESS_Y = -1;
    svgPolylineProperties.changeLastPoint(USELESS_X, USELESS_Y);

    const EXPECTED_NUMBER_POINTS = 0;
    const EXPECTED_LENGTH = 0;
    expect(svgPolylineProperties.howManyPoints()).toEqual(EXPECTED_NUMBER_POINTS);
    expect(svgPolylineProperties.rawSvgPointsLength()).toEqual(EXPECTED_LENGTH);
  });

  it('#setThickness() changes thickness with valid input', () => {
    const VALID_THICKNESS = 1;
    svgPolylineProperties.setThickness(VALID_THICKNESS);
    expect(svgPolylineProperties.getThickness()).toEqual(VALID_THICKNESS);
  });

  it('#setThickness() does not change thickness with negative input', () => {
    const WRONG_THICKNESS = -1;
    const RIGHT_THICKNESS = svgPolylineProperties.getThickness();
    svgPolylineProperties.setThickness(WRONG_THICKNESS);
    expect(svgPolylineProperties.getThickness()).toEqual(RIGHT_THICKNESS);
  });

  it('#setThickness() does not change thickness with 0 input', () => {
    const WRONG_THICKNESS = 0;
    const RIGHT_THICKNESS = svgPolylineProperties.getThickness();
    svgPolylineProperties.setThickness(WRONG_THICKNESS);
    expect(svgPolylineProperties.getThickness()).toEqual(RIGHT_THICKNESS);
  });

  it('#setJunctionRadius() changes junctionRadius with positive radius', () => {
    const VALID_RADIUS = 1;
    svgPolylineProperties.setJunctionRadius(VALID_RADIUS);
    expect(svgPolylineProperties.getJunctionRadius()).toEqual(VALID_RADIUS);
  });

  it('#setJunctionRadius() sets junctionRadius to 0 with radius=0', () => {
    const OLD_RADIUS = 1;
    svgPolylineProperties.setJunctionRadius(OLD_RADIUS);
    const ZERO_RADIUS = 0;
    svgPolylineProperties.setJunctionRadius(ZERO_RADIUS);
    expect(svgPolylineProperties.getJunctionRadius()).toEqual(ZERO_RADIUS);
  });

  it('#setJunctionRadius() sets junctionRadius to 0 with negative radius', () => {
    const INVALID_RADIUS = -1;
    const ZERO_RADIUS = 0;
    svgPolylineProperties.setJunctionRadius(INVALID_RADIUS);
    expect(svgPolylineProperties.getJunctionRadius()).toEqual(ZERO_RADIUS);
  });
  it('#getBoundary() returns correct Boundary ', () => {
    const POINT1: Point = {x: 10, y: 20};
    const POINT2: Point = {x: 10, y: 30};
    const POINT_ARRAY = [POINT1, POINT2];
    const THICKNESS = 10;
    svgPolylineProperties.setThickness(THICKNESS);
    svgPolylineProperties.setPoint(POINT_ARRAY);
    const boundary = BoundaryBox.create(svgPolylineProperties.getPoint());
    const ADDITIONAL_EXPANSION = svgPolylineProperties.getThickness() / 2;
    boundary.topLeft.x -= ADDITIONAL_EXPANSION;
    boundary.topLeft.y -= ADDITIONAL_EXPANSION;
    boundary.bottomRight.x += ADDITIONAL_EXPANSION;
    boundary.bottomRight.y += ADDITIONAL_EXPANSION;
    const EXPECT_BOUNDARY = svgPolylineProperties.getBoundary();
    expect(EXPECT_BOUNDARY).toEqual(boundary);
  });

  it('#getCollidables() returns lines and circles when junctionRadius > 0', () => {
    const RADIUS = 33;
    svgPolylineProperties.setJunctionRadius(RADIUS);
    svgPolylineProperties.setPoint([
      {x: 0, y: 0},
      {x: 100, y: 100},
    ]);
    const collidables = svgPolylineProperties.getCollidables();
    const NUMBER_OF_COLLIDABLES = 1 + 2;
    expect(collidables.length).toBe(NUMBER_OF_COLLIDABLES);
    expect(collidables[0] instanceof LineCollidable).toBeTruthy();
    expect(collidables[1] instanceof CircleCollidable && collidables[2] instanceof CircleCollidable).toBeTruthy();
  });

  it('#getCollidables() returns only lines when junctionRadius = 0', () => {
    svgPolylineProperties.setPoint([
      {x: 0, y: 0},
      {x: 100, y: 100},
    ]);
    const collidables = svgPolylineProperties.getCollidables();
    expect(collidables.length).toBe(1);
    expect(collidables[0] instanceof LineCollidable).toBeTruthy();
  });

  it('#pointString()  should return the string of svg polyline', () => {
    const SVG_DELIMITER = ' ';
    const POINTS = {x: 2, y: 4};
    const SVG_POLYLINE =  POINTS.x.toString()
        + SVG_DELIMITER + POINTS.y.toString() + SVG_DELIMITER;
    const  EXPECTED_NUMBER_POINTS = svgPolylineProperties.testPointString(POINTS);
    expect(SVG_POLYLINE === EXPECTED_NUMBER_POINTS).toBe(true);
  });

  it('#refreshRawSvgPoints() should return the string of svg polyline', () => {
    let newPoints = '';
    const POINTS = {x: 2, y: 4};
    newPoints += svgPolylineProperties.testPointString(POINTS);
    svgPolylineProperties.setRawSvgPoints(newPoints);
    svgPolylineProperties.testRefreshRawSvgPoint();
    const EXPECTED_POINTS = '';
    expect (svgPolylineProperties.getRawSvgPoints()).toEqual(EXPECTED_POINTS);
  });

});

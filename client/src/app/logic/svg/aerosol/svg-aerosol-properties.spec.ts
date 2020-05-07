import { Point } from '../../../interfaces/point';
import { Coords } from '../../../services/tool-manager/tools/coords';
import { CircleCollidable } from '../../collisions/circle/circle-collidable';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import { SvgAerosolProperties } from './svg-aerosol-properties';

class SvgAerosolTestable extends SvgAerosolProperties {
  constructor() {super(); }

  getCenterRadius(): number { return this.centerRadius; }
  getCenterPoints(): Coords[] { return this.centerPoints; }
  testRefresh(): void {this.refreshRawSvgPoints(); }
  testPointString(point: Coords): string { return this.pointString(point); }
  howManyPoints(): number {return this.points.length; }
  rawSvgPointsLength(): number {return this.rawSvgPoints.length; }
}

describe('SvgAerosolProperties', () => {
  let svgAerosolProperties: SvgAerosolTestable;

  beforeEach(() => {
    svgAerosolProperties = new SvgAerosolTestable();
  });

  it('should create an instance', () => {
    expect(new SvgAerosolTestable()).toBeTruthy();
  });

  it('#getCenter() works as expected', () => {
    svgAerosolProperties.setHitBox([{x: 0, y: 0}, {x: 2, y: 2}], 1);
    expect(svgAerosolProperties.getCenter()).toEqual({x: 1, y: 1});
  });

  it('#rotateClockWise() works as expected', () => {
    const QUARTER_TURN = 90;
    svgAerosolProperties.setHitBox([{x: -1, y: 0}, {x: 1, y: 0}], 1);
    svgAerosolProperties.setPoints([{x: -1, y: 0}, {x: 1, y: 0}]);
    svgAerosolProperties.rotateClockwise(QUARTER_TURN);

    const boundary = svgAerosolProperties.getBoundary();
    expect({x: Math.round(boundary.topLeft.x) + 0, y: boundary.topLeft.y}).toEqual({x: 0, y: -1});
    expect({x: Math.round(boundary.bottomRight.x) + 0, y: boundary.bottomRight.y}).toEqual({x: 0, y: 1});
  });

  it('#scale() works as expected', () => {
    svgAerosolProperties.setHitBox([{x: -1, y: -1}, {x: 1, y: 1}], 1);
    svgAerosolProperties.setPoints([{x: -1, y: -1}, {x: 1, y: 1}]);

    svgAerosolProperties.scale(2, {x: 1, y: 0});
    const boundary = svgAerosolProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: -2, y: -1});
    expect(boundary.bottomRight).toEqual({x: 2, y: 1});
  });

  it('#addPoint() appends rawPath correctly', () => {
    const X = -5;
    const Y = 4;
    svgAerosolProperties.addPoint(X, Y);
    const EXPECTED_NUMBER_POINTS = 1;
    const EXPECTED_LENGTH = 11;
    expect(svgAerosolProperties.howManyPoints()).toEqual(EXPECTED_NUMBER_POINTS);
    expect(svgAerosolProperties.rawSvgPointsLength()).toEqual(EXPECTED_LENGTH);
  });

  it('#addPoint() appends rawPath correctly for multiple insertions', () => {
    const X1 = -5;
    const Y1 = 4;
    svgAerosolProperties.addPoint(X1, Y1);
    const X2 = 2;
    const Y2 = 2;
    svgAerosolProperties.addPoint(X2, Y2);
    const X3 = 1;
    const Y3 = -1;
    svgAerosolProperties.addPoint(X3, Y3);

    const EXPECTED_NUMBER_POINTS = 3;
    const EXPECTED_LENGTH = 32;
    expect(svgAerosolProperties.howManyPoints()).toEqual(EXPECTED_NUMBER_POINTS);
    expect(svgAerosolProperties.rawSvgPointsLength()).toEqual(EXPECTED_LENGTH);
  });

  it('#refreshRawPath() does nothing if points is empty', () => {
    svgAerosolProperties.testRefresh();
    const EXPECTED_NUMBER_POINTS = 0;
    const EXPECTED_LENGTH = 0;
    expect(svgAerosolProperties.howManyPoints()).toEqual(EXPECTED_NUMBER_POINTS);
    expect(svgAerosolProperties.rawSvgPointsLength()).toEqual(EXPECTED_LENGTH);
  });

  it('#setHitBox() should change value of centerPoints and centreRadius', () => {
    const POINT: Point = {x: 2, y: 4};
    const EXPECTED_NUMBER_POINTS = new Coords(POINT.x, POINT.y);
    const SECOND_EXPECTED_NUMBER_POINTS = new Coords (POINT.y, POINT.x);
    const EXPECTED_COORDS_POINTS  = [EXPECTED_NUMBER_POINTS, SECOND_EXPECTED_NUMBER_POINTS] ;
    const RADIUS = 7;
    svgAerosolProperties.setHitBox(EXPECTED_COORDS_POINTS, RADIUS);
    expect(svgAerosolProperties.getCenterPoints() === EXPECTED_COORDS_POINTS).toBe(true);
    expect (svgAerosolProperties.getCenterRadius() === RADIUS).toBe(true);
  });

  it('#setPoints() should setting the points in points array ', () => {
    const POINT: Point = {x: 2, y: 4};
    const EXPECTED_NUMBER_POINTS = new Coords(POINT.x, POINT.y);
    const SECOND_EXPECTED_NUMBER_POINTS = new Coords (POINT.y, POINT.x);
    const EXPECTED_COORDS_POINTS  = [EXPECTED_NUMBER_POINTS, SECOND_EXPECTED_NUMBER_POINTS] ;
    const refreshRawSvgSpy = spyOn(svgAerosolProperties, 'testRefresh');
    svgAerosolProperties.setPoints(EXPECTED_COORDS_POINTS);
    expect(refreshRawSvgSpy).not.toHaveBeenCalled();
  });

  it('#translate() should translate aerosolSvgObject in dx and dy', () => {
    const refreshRawSvgSpy = spyOn(svgAerosolProperties, 'testRefresh');
    svgAerosolProperties.translate({x: -5, y: 4});
    expect(refreshRawSvgSpy).not.toHaveBeenCalled();
  });

  it('#pointString() should return the string of svg path', () => {
    const SVG_START = 'M';
    const SVG_POINT = ' l1 1 ';
    const SVG_DELIMITER = ' ';
    const POINT: Point = {x: 2, y: 4};
    const POINTS = new Coords(POINT.x, POINT.y);
    const SVGPATH = SVG_START + POINTS.x.toString()
      + SVG_DELIMITER + POINTS.y.toString() + SVG_POINT;
    const  EXPECTED_NUMBER_POINTS = svgAerosolProperties.testPointString(POINTS);
    expect(SVGPATH === EXPECTED_NUMBER_POINTS).toBe(true);
  });

  it('#getCollidables() returns circleCollidables', () => {
    const RADIUS = 10;
    svgAerosolProperties.setHitBox([{x: 10, y: 10}, {x: 20, y: 20}], RADIUS);
    const collidables = svgAerosolProperties.getCollidables();
    expect(collidables.length).toBe(2);
    expect(collidables[0] instanceof CircleCollidable).toBeTruthy();
    expect(collidables[1] instanceof CircleCollidable).toBeTruthy();
  });

  it('#getBoundary() should call creatUnitPolygon, scalePolygon and refreshRawSvgPoints ', () => {
    // tslint:disable-next-line:no-any
    const getBoundarySpy = spyOn<any>(BoundaryBox, 'create');
    svgAerosolProperties.getBoundary();
    expect(getBoundarySpy).toHaveBeenCalled();
  });
});

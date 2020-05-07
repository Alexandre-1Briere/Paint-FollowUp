import { Point } from '../../../interfaces/point';
import { Coords } from '../../../services/tool-manager/tools/coords';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import { SvgPencilProperties } from './svg-pencil-properties';

class SvgPencilTestable extends SvgPencilProperties {
  constructor() {super(); }
  setPoint(point: Point[] ): void { this.points = point; }
  testRefreshLastPoint(): void {this.refreshLastPointRawPath(); }
  howManyPoints(): number {return this.points.length; }
  rawSvgPointsLength(): number {return this.rawPath.length; }
  testPointString(point: Point): string { return this.pointString(point); }
  testFirstPointString(point: Point): string { return this.firstPointString(point); }
}

const POINTS = 'points';

describe('SvgPencilProperties', () => {
  let svgPencilProperties: SvgPencilTestable;

  beforeEach(() => {
    svgPencilProperties = new SvgPencilTestable();
  });

  it('should create an instance', () => {
    expect(new SvgPencilProperties()).toBeTruthy();
  });

  it('#getCenter() works as expected', () => {
    svgPencilProperties.addPoint(0, 0);
    svgPencilProperties.addPoint(2, 2);
    expect(svgPencilProperties.getCenter()).toEqual({x: 1, y: 1});
  });

  it('#translate() works as expected', () => {
    svgPencilProperties.addPoint(0, 0);
    const POSITION: Point = {x: 10, y: 5};
    const TRANSLATION: Point = {x: -10, y: 10};
    svgPencilProperties.addPoint(POSITION.x, POSITION.y);
    svgPencilProperties.translate(TRANSLATION);
    const points = svgPencilProperties[POINTS];
    expect(points[0]).toEqual({x: -10, y: 10});
    expect(points[1]).toEqual({x: 0, y: 15});
  });

  it('#rotateClockWise() works as expected', () => {
    const QUARTER_TURN = 90;
    svgPencilProperties.addPoint(0, -1);
    svgPencilProperties.addPoint(0, 1);
    svgPencilProperties.setThickness(2);
    svgPencilProperties.rotateClockwise(QUARTER_TURN);

    const boundary = svgPencilProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: -2, y: -1});
    expect(boundary.bottomRight).toEqual({x: 2, y: 1});
  });

  it('#scale() works as expected', () => {
    svgPencilProperties.addPoint(-1 / 2, -1);
    svgPencilProperties.addPoint(1 / 2, 1);
    svgPencilProperties.setThickness(2);
    svgPencilProperties.scale(2, {x: 2, y: 0});

    const boundary = svgPencilProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: -5, y: -1.5});
    expect(boundary.bottomRight).toEqual({x: 5, y: 1.5});
  });

  it('#addPoint() appends rawPath correctly', () => {
    const X = -5;
    const Y = 4;
    svgPencilProperties.addPoint(X, Y);

    const EXPECTED_NUMBER_POINTS = 1;
    const EXPECTED_LENGTH = 6;
    expect(svgPencilProperties.howManyPoints()).toEqual(EXPECTED_NUMBER_POINTS);
    expect(svgPencilProperties.rawSvgPointsLength()).toEqual(EXPECTED_LENGTH);
  });

  it('#addPoint() appends rawPath correctly for multiple insertions', () => {
    const X1 = -5;
    const Y1 = 4;
    svgPencilProperties.addPoint(X1, Y1);
    const X2 = 2;
    const Y2 = 2;
    svgPencilProperties.addPoint(X2, Y2);
    const X3 = 1;
    const Y3 = -1;
    svgPencilProperties.addPoint(X3, Y3);

    const EXPECTED_NUMBER_POINTS = 3;
    const EXPECTED_LENGTH = 17;
    expect(svgPencilProperties.howManyPoints()).toEqual(EXPECTED_NUMBER_POINTS);
    expect(svgPencilProperties.rawSvgPointsLength()).toEqual(EXPECTED_LENGTH);
  });

  it('#changeLastPoint() works as expected', () => {
    const INITIAL_X = 3;
    const INITIAL_Y = 2;
    svgPencilProperties.addPoint(INITIAL_X, INITIAL_Y);

    const NEW_X = 99;
    const NEW_Y = 10;
    svgPencilProperties.changeLastPoint(NEW_X, NEW_Y);

    const EXPECTED_NUMBER_POINTS = 1;
    const EXPECTED_LENGTH = 7;
    expect(svgPencilProperties.howManyPoints()).toEqual(EXPECTED_NUMBER_POINTS);
    expect(svgPencilProperties.rawSvgPointsLength()).toEqual(EXPECTED_LENGTH);
  });

  it('#changeLastPoint() does nothing if no point has been added', () => {
    const USELESS_X = 1;
    const USELESS_Y = -1;
    svgPencilProperties.changeLastPoint(USELESS_X, USELESS_Y);

    const EXPECTED_NUMBER_POINTS = 0;
    const EXPECTED_LENGTH = 0;
    expect(svgPencilProperties.howManyPoints()).toEqual(EXPECTED_NUMBER_POINTS);
    expect(svgPencilProperties.rawSvgPointsLength()).toEqual(EXPECTED_LENGTH);
  });

  it('#refreshLastPointRawPath() does nothing if points is empty', () => {
    svgPencilProperties.testRefreshLastPoint();
    const EXPECTED_NUMBER_POINTS = 0;
    const EXPECTED_LENGTH = 0;
    expect(svgPencilProperties.howManyPoints()).toEqual(EXPECTED_NUMBER_POINTS);
    expect(svgPencilProperties.rawSvgPointsLength()).toEqual(EXPECTED_LENGTH);
  });

  it('#setThickness() does not change thickness with 0 input', () => {
    const WRONG_THICKNESS = 0;
    const RIGHT_THICKNESS = svgPencilProperties.getThickness();
    svgPencilProperties.setThickness(WRONG_THICKNESS);
    expect(svgPencilProperties.getThickness()).toEqual(RIGHT_THICKNESS);
  });

  it('#setThickness()  changes thickness with valid input', () => {
    const VALID_THICKNESS = 1;
    svgPencilProperties.setThickness(VALID_THICKNESS);
    expect(svgPencilProperties.getThickness()).toEqual(VALID_THICKNESS);
  });

  it('#setThickness() does not change thickness with negative input', () => {
    const WRONG_THICKNESS = -1;
    const RIGHT_THICKNESS = svgPencilProperties.getThickness();
    svgPencilProperties.setThickness(WRONG_THICKNESS);
    expect(svgPencilProperties.getThickness()).toEqual(RIGHT_THICKNESS);
  });

  it('#setThickness() does not change thickness with 0 input', () => {
    const WRONG_THICKNESS = 0;
    const RIGHT_THICKNESS = svgPencilProperties.getThickness();
    svgPencilProperties.setThickness(WRONG_THICKNESS);
    expect(svgPencilProperties.getThickness()).toEqual(RIGHT_THICKNESS);
  });

  it('#pointString() should return the string of svg pencil', () => {
    const LINE = 'L';
    const SVG_DELIMITER = ' ';
    const POSITION: Point = {x: 2, y: 4};
    const POINT = new Coords(POSITION.x, POSITION.y);
    const SVG_PENCIL =  LINE + POINT.x.toString()
        + SVG_DELIMITER + POINT.y.toString() + SVG_DELIMITER;
    const  EXPECTED_NUMBER_POINTS = svgPencilProperties.testPointString(POINT);
    expect(SVG_PENCIL === EXPECTED_NUMBER_POINTS).toBe(true);
  });

  it('#firstPointString() should return the string of svg pencil', () => {
    const FIRST_COMMAND = 'M';
    const SVG_DELIMITER = ' ';
    const POSITION: Point = {x: 2, y: 4};
    const POINT = new Coords(POSITION.x, POSITION.y);
    const SVG_DELIMITER_PENCIL = FIRST_COMMAND + POINT.x.toString()
        + SVG_DELIMITER + POINT.y.toString() + SVG_DELIMITER;
    const  EXPECTED_NUMBER_POINTS = svgPencilProperties.testFirstPointString(POINT);
    expect(SVG_DELIMITER_PENCIL === EXPECTED_NUMBER_POINTS).toBe(true);
  });

  it('#getCollidables() should correct number of Collidable', () => {
    svgPencilProperties.addPoint(0, 0);

    const POSITION1: Point = {x: 1000, y: 1000};
    const POSITION2: Point = {x: 600, y: 500};
    svgPencilProperties.addPoint(POSITION1.x, POSITION1.y);
    svgPencilProperties.addPoint(POSITION2.x, POSITION2.y);
    expect(svgPencilProperties.getCollidables().length).toBe(2);
  });

  it('#getCollidables() should call getCollidable', () => {
    spyOn(svgPencilProperties, 'getCollidables');
    svgPencilProperties.getCollidables();
    expect(svgPencilProperties.getCollidables).toHaveBeenCalled();
  });

  it('#getBoundary() should a object Boundary ', () => {
    const POINT1: Point = {x: 10, y: 20};
    const POINT2: Point = {x: 10, y: 30};
    const POINT_ARRAY = [POINT1, POINT2];
    const THICKNESS = 10;
    svgPencilProperties.setThickness(THICKNESS);
    svgPencilProperties.setPoint(POINT_ARRAY);
    const boundary = BoundaryBox.create(svgPencilProperties[POINTS]);
    const ADDITIONAL_EXPANSION = svgPencilProperties.getThickness() / 2;
    boundary.topLeft.x -= ADDITIONAL_EXPANSION;
    boundary.topLeft.y -= ADDITIONAL_EXPANSION;
    boundary.bottomRight.x += ADDITIONAL_EXPANSION;
    boundary.bottomRight.y += ADDITIONAL_EXPANSION;
    const EXPECT_BOUNDARY =  svgPencilProperties.getBoundary();
    expect(EXPECT_BOUNDARY).toEqual(boundary);
  });

});

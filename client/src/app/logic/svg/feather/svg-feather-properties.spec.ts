import { Point } from '../../../interfaces/point';
import { Coords } from '../../../services/tool-manager/tools/coords';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import { LineCoordinates } from './line-coordianates/line-coordinates';
import { SvgFeatherProperties } from './svg-feather-properties';

class SvgFeatherTestable extends SvgFeatherProperties {
    constructor() {super(); }
    setPoint(point: Point[] ): void { this.points = point; }
    getLineCoordinates(): LineCoordinates { return this.lineCoordinates; }
    testRefreshRawPath(): void {this.refreshRawPath(); }
    howManyPoints(): number {return this.points.length; }
    rawSvgPointsLength(): number {return this.rawPath.length; }
    testPointString(point: Point): string { return this.pointString(point); }
    testFirstLinePath(point: Point): string { return this.firstLinePath(point); }
    testEndPointString(point: Point): string { return this.endPointString(point); }
}

const POINTS = 'points';
const HALF_TURN_DEGREES = 180;

describe('SvgFeatherProperties', () => {
    let svgFeatherProperties: SvgFeatherTestable;

    beforeEach(() => {
        svgFeatherProperties = new SvgFeatherTestable();
    });

    it('should create an instance', () => {
        expect(new SvgFeatherProperties()).toBeTruthy();
    });

    it('#getCenter() works as expected', () => {
      svgFeatherProperties.addPoint(0, 0);
      svgFeatherProperties.addPoint(2, 2);
      expect(svgFeatherProperties.getCenter()).toEqual({x: 1, y: 1});
    });

    it('#translate()  works as expected', () =>  {
        svgFeatherProperties.addPoint(0, 0);
        const POSITION: Point = {x: 10, y: 5};
        const TRANSLATION: Point = {x: -10, y: 10};
        svgFeatherProperties.addPoint(POSITION.x, POSITION.y);
        svgFeatherProperties.translate(TRANSLATION);
        const points = svgFeatherProperties[POINTS];
        expect(points[0]).toEqual({x: -10, y: 10});
        expect(points[1]).toEqual({x: 0, y: 15});
    });

    it('#rotateClockWise() works as expected', () => {
      const QUARTER_TURN = 90;
      svgFeatherProperties.addPoint(0, 1);
      svgFeatherProperties.addPoint(0, -1);
      svgFeatherProperties.setSizeOfLine(2);
      svgFeatherProperties.rotateClockwise(QUARTER_TURN);

      const boundary = svgFeatherProperties.getBoundary();
      expect(boundary.topLeft).toEqual({x: -2, y: -1});
      expect(boundary.bottomRight).toEqual({x: 2, y: 1});
    });

    it('#scale() works as expected', () => {
      svgFeatherProperties.addPoint(1, 1);
      svgFeatherProperties.addPoint(-1, -1);
      svgFeatherProperties.setSizeOfLine(2);
      svgFeatherProperties.scale(2, {x: 1, y: 0});

      const boundary = svgFeatherProperties.getBoundary();
      expect(boundary.topLeft).toEqual({x: -4, y: -2});
      expect(boundary.bottomRight).toEqual({x: 4, y: 2});
    });

    it('#getPointProjection() works as expected', () => {
        const POINT: Point = {x: 2, y: 4};
        const EXPECTED_PROJECTION = POINT.x * Math.sin(svgFeatherProperties.getRotationAngle() * Math.PI / HALF_TURN_DEGREES) +
            POINT.y * Math.cos(svgFeatherProperties.getRotationAngle() * Math.PI / HALF_TURN_DEGREES);
        const POINT_PROJECTION = svgFeatherProperties. getPointProjection(POINT);
        expect(EXPECTED_PROJECTION).toEqual(POINT_PROJECTION);
    });

    it('#addPoint() appends rawPath correctly', () => {
        const X = -5;
        const Y = 4;
        svgFeatherProperties.addPoint(X, Y);
        const EXPECTED_NUMBER_POINTS = 1;
        const EXPECTED_LENGTH = 193;
        expect(svgFeatherProperties.howManyPoints()).toEqual(EXPECTED_NUMBER_POINTS);
        expect(svgFeatherProperties.rawSvgPointsLength()).toEqual (EXPECTED_LENGTH);
    });

    it('#addPoint() appends rawPath correctly for multiple insertions', () => {
        const X1 = -5;
        const Y1 = 4;
        svgFeatherProperties.addPoint(X1, Y1);
        const X2 = 2;
        const Y2 = 2;
        svgFeatherProperties.addPoint(X2, Y2);
        const X3 = 1;
        const Y3 = -1;
        svgFeatherProperties.addPoint(X3, Y3);

        const EXPECTED_NUMBER_POINTS = 3;
        const EXPECTED_LENGTH = 590;
        expect(svgFeatherProperties.howManyPoints()).toEqual(EXPECTED_NUMBER_POINTS);
        expect(svgFeatherProperties.rawSvgPointsLength()).toEqual( EXPECTED_LENGTH);
    });

    it('#setRotationAngle changes rotation angle with valid input', () => {
        const VALID_ROTATION_ANGLE = 1;
        svgFeatherProperties.setRotationAngle(VALID_ROTATION_ANGLE);
        expect(svgFeatherProperties.getRotationAngle()).toEqual(VALID_ROTATION_ANGLE);
    });

    it('#setRotationAngle does not change rotation angle with negative input', () => {
        const WRONG_ROTATION_ANGLE = -1;
        const RIGHT_ROTATION_ANGLE = svgFeatherProperties.getRotationAngle();
        svgFeatherProperties.setRotationAngle(WRONG_ROTATION_ANGLE);
        expect(svgFeatherProperties.getRotationAngle()).toEqual(RIGHT_ROTATION_ANGLE);
    });

    it('#setSizeOfLine()  does not change size of line  with 0 input', () => {
        const WRONG_SIZE_OF_LINE = 0;
        const RIGHT_SIZE_OF_LINE = svgFeatherProperties.getSizeOfLine();
        svgFeatherProperties.setSizeOfLine(WRONG_SIZE_OF_LINE);
        expect(svgFeatherProperties.getSizeOfLine()).toEqual(RIGHT_SIZE_OF_LINE);
    });

    it('#setSizeOfLine() changes size of line with valid input', () => {
        const VALID_SIZE_OF_LINE = 1;
        svgFeatherProperties.setSizeOfLine(VALID_SIZE_OF_LINE);
        expect(svgFeatherProperties.getSizeOfLine()).toEqual(VALID_SIZE_OF_LINE);
    });

    it('#setSizeOfLine()  does not change size of line with negative input', () => {
        const WRONG_SIZE_OF_LINE = -1;
        const RIGHT_SIZE_OF_LINE = svgFeatherProperties.getSizeOfLine();
        svgFeatherProperties.setSizeOfLine(WRONG_SIZE_OF_LINE);
        expect(svgFeatherProperties.getSizeOfLine()).toEqual(RIGHT_SIZE_OF_LINE);
    });

    it('#setSizeOfLine() does not change size of line with 0 input', () => {
        const WRONG_SIZE_OF_LINE = 0;
        const RIGHT_SIZE_OF_LINE = svgFeatherProperties.getSizeOfLine();
        svgFeatherProperties.setSizeOfLine(WRONG_SIZE_OF_LINE);
        expect(svgFeatherProperties.getSizeOfLine()).toEqual(RIGHT_SIZE_OF_LINE);
    });

    it('#refreshRawPath() does nothing if points is empty', () => {
        svgFeatherProperties.testRefreshRawPath();
        const EXPECTED_NUMBER_POINTS = 0;
        const EXPECTED_LENGTH = 0;
        expect(svgFeatherProperties.howManyPoints()).toEqual(EXPECTED_NUMBER_POINTS);
        expect(svgFeatherProperties.rawSvgPointsLength()).toEqual(EXPECTED_LENGTH);
    });

    it('#pointString()  should return the string of svg feather', () => {
        const LINE = 'L';
        const SVG_DELIMITER = ' ';
        const POSITION: Point = {x: 2, y: 4};
        const POINT = new Coords(POSITION.x, POSITION.y);
        const SVG_FEATHER =  LINE + svgFeatherProperties.getLineCoordinates().getX1(POINT.x).toString()
            + SVG_DELIMITER + svgFeatherProperties.getLineCoordinates().getY1(POINT.y).toString() + SVG_DELIMITER +
            LINE + svgFeatherProperties.getLineCoordinates().getX2(POINT.x).toString() + SVG_DELIMITER
            + svgFeatherProperties.getLineCoordinates().getY2(POINT.y).toString() + SVG_DELIMITER;
        const  EXPECTED_NUMBER_POINTS = svgFeatherProperties.testPointString(POINT);
        expect(SVG_FEATHER).toEqual( EXPECTED_NUMBER_POINTS);
    });

    it('#firstLinePath() should return the string of svg feather', () => {
        const FIRST_COMMAND = 'M';
        const LINE = 'L';
        const SVG_DELIMITER = ' ';
        const POSITION: Point = {x: 2, y: 4};
        const POINT = new Coords(POSITION.x, POSITION.y);
        const SVG_FEATHER =  FIRST_COMMAND + svgFeatherProperties.getLineCoordinates().getX2(POINT.x).toString()
            + SVG_DELIMITER + svgFeatherProperties.getLineCoordinates().getY2(POINT.y).toString() + SVG_DELIMITER +
            LINE + svgFeatherProperties.getLineCoordinates().getX1(POINT.x).toString() + SVG_DELIMITER
            + svgFeatherProperties.getLineCoordinates().getY1(POINT.y).toString() + SVG_DELIMITER;
        const  EXPECTED_NUMBER_POINTS = svgFeatherProperties.testFirstLinePath(POINT);
        expect(SVG_FEATHER).toEqual(EXPECTED_NUMBER_POINTS);
    });

    it('#endPointString()  should return the string of svg feather', () => {
        const LINE = 'L';
        const SVG_DELIMITER = ' ';
        const POSITION: Point = {x: 2, y: 4};
        const POINT = new Coords(POSITION.x, POSITION.y);
        const SVG_FEATHER =  LINE + svgFeatherProperties.getLineCoordinates().getX2(POINT.x).toString()
            + SVG_DELIMITER + svgFeatherProperties.getLineCoordinates().getY2(POINT.y).toString() + SVG_DELIMITER;
        const  EXPECTED_NUMBER_POINTS = svgFeatherProperties.testEndPointString(POINT);
        expect(SVG_FEATHER).toEqual( EXPECTED_NUMBER_POINTS);
    });

    it('#getCollidables()  should correct number of Collidable', () => {
        svgFeatherProperties.addPoint(0, 0);
        const POSITION1: Point = {x: 1000, y: 1000};
        const POSITION2: Point = {x: 600, y: 500};
        svgFeatherProperties.addPoint(POSITION1.x, POSITION1.y);
        svgFeatherProperties.addPoint(POSITION2.x, POSITION2.y);
        expect(svgFeatherProperties.getCollidables().length).toBe(2);
    });

    it('#getCollidables() should call getCollidable', () => {
        spyOn(svgFeatherProperties, 'getCollidables');
        svgFeatherProperties.getCollidables();
        expect(svgFeatherProperties.getCollidables).toHaveBeenCalled();
    });

    it('#getBoundary() should a object Boundary ', () => {
        const POINT1: Point = {x: 10, y: 20};
        const POINT2: Point = {x: 10, y: 30};
        const POINT_ARRAY = [POINT1, POINT2];
        const SIZE_OF_LINE = 10;
        svgFeatherProperties.setSizeOfLine(SIZE_OF_LINE);
        svgFeatherProperties.setPoint(POINT_ARRAY);
        const boundary = BoundaryBox.create(svgFeatherProperties[POINTS]);
        const ADDITIONAL_EXPANSION = svgFeatherProperties.getSizeOfLine() / 2;
        boundary.topLeft.x -= ADDITIONAL_EXPANSION;
        boundary.topLeft.y -= ADDITIONAL_EXPANSION;
        boundary.bottomRight.x += ADDITIONAL_EXPANSION;
        boundary.bottomRight.y += ADDITIONAL_EXPANSION;
        const EXPECT_BOUNDARY =  svgFeatherProperties.getBoundary();
        expect(EXPECT_BOUNDARY).toEqual(boundary);
    });

});

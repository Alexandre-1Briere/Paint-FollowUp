import { SvgType } from '../../../enums/svg';
import { Point } from '../../../interfaces/point';
import { Boundary } from '../../collisions/base-collision/boundary';
import { Collidable } from '../../collisions/base-collision/collidable';
import { SetOfPoints } from '../../collisions/points/set-of-points';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import { SvgProperties } from '../base-svg/svg-properties';
import { SvgUtils } from '../utils/svg-utils';
import { LineCoordinates } from './line-coordianates/line-coordinates';

const NO_POINTS = '';
const  DEFAULT_ROTATION_ANGLE   = 45;
const  DEFAULT_SIZE_OF_LINE = 34;
const HALF_TURN_DEGREES = 180;
export class SvgFeatherProperties extends SvgProperties {
    protected points: Point[];
    protected lineCoordinates: LineCoordinates;
    protected previousPoint: Point;
    protected sizeOfLine: number;
    protected displaySizeOfLine: number;
    protected rotationAngle: number;
    protected rawPath: string;

    constructor(svgType: SvgType = SvgType.SvgFeatherComponent) {
        super(svgType);
        this.points = [];
        this.rawPath = NO_POINTS;
        this.sizeOfLine = DEFAULT_SIZE_OF_LINE;
        this.displaySizeOfLine = DEFAULT_SIZE_OF_LINE;
        this.rotationAngle = DEFAULT_ROTATION_ANGLE;
        this.lineCoordinates = new LineCoordinates(this.rotationAngle, this.sizeOfLine);
    }

    getCenter(): Point {
        return SvgUtils.getCenter(this.points);
    }

    translate(delta: Point): void {
        super.translate(delta);
        SvgUtils.translateAll(delta, this.points);
        this.refreshRawPath();
    }

    rotateClockwise(degrees: number): void {
        const center = this.getCenter();
        SvgUtils.rotateClockWise(degrees, center, this.points);
        this.refreshRawPath();
    }

    scale(percentage: number, direction: Point): void {
        this.setSizeOfLine(
          SvgUtils.scalePointsWithThickness(this.sizeOfLine, this.points, percentage, direction)
        );
        this.refreshRawPath();
    }

    addPoint(x: number, y: number): void {
        this.points.push({x, y});
        this.refreshRawPath();
    }

    setRotationAngle(rotationAngle: number): void {
        const MINIMUM_ANGLE = 0;
        if (rotationAngle >= MINIMUM_ANGLE) {
            this.rotationAngle = rotationAngle;
            this.lineCoordinates = new LineCoordinates(this.rotationAngle, this.sizeOfLine);
            this.refreshRawPath();
            console.log(this.rotationAngle);
        }
    }
    getRotationAngle(): number { return this.rotationAngle; }

    getPointProjection(point: Point): number {
      return   point.x * Math.sin(this.rotationAngle * Math.PI / HALF_TURN_DEGREES) +
        point.y * Math.cos(this.rotationAngle * Math.PI / HALF_TURN_DEGREES);
    }

    setSizeOfLine(sizeOfLine: number): void {
        if (sizeOfLine > 0) {
          this.sizeOfLine = sizeOfLine;
        }
        const MINIMUM_SIZE = 1;
        this.displaySizeOfLine = Math.max(this.sizeOfLine, MINIMUM_SIZE);
    }
    getSizeOfLine(): number { return this.displaySizeOfLine; }

    protected refreshRawPath(): void {
        let newRawPath = '';
        this.previousPoint = { x : 0 , y: 0 };
        for (const point of this.points) {
                if (newRawPath === '') {
                newRawPath += this.firstLinePath(point) + this.pointString(point) + this.endPointString(point);
                } else {
                    if (this.getPointProjection(this.previousPoint) > this.getPointProjection(point)) {
                        newRawPath += this.firstLinePath(this.previousPoint) + this.pointString(point)
                            + this.endPointString(this.previousPoint);
                    } else {
                        newRawPath += this.firstLinePath(point) + this.pointString(this.previousPoint)
                            + this.endPointString(point);
                    }
                }
                this.previousPoint = point;
            }
        this.rawPath = newRawPath;
    }

    protected endPointString(point: Point): string {
        const LINE = 'L';
        const SVG_DELIMITER = ' ';
        return LINE +
            + this.lineCoordinates.getX2(point.x).toString()
            + SVG_DELIMITER
            + this.lineCoordinates.getY2(point.y).toString()
            + SVG_DELIMITER ;

    }

    protected pointString(point: Point): string {
        const LINE = 'L';
        const SVG_DELIMITER = ' ';
        return LINE
            + this.lineCoordinates.getX1(point.x).toString()
            + SVG_DELIMITER
            + this.lineCoordinates.getY1(point.y).toString()
            + SVG_DELIMITER + LINE
            + this.lineCoordinates.getX2(point.x).toString()
            + SVG_DELIMITER
            + this.lineCoordinates.getY2(point.y).toString()
            + SVG_DELIMITER;

    }

    protected firstLinePath(point: Point): string {
        const FIRST_COMMAND = 'M';
        const SVG_DELIMITER = ' ';
        const LINE = 'L';
        return FIRST_COMMAND
            + this.lineCoordinates.getX2(point.x).toString()
            + SVG_DELIMITER
            + this.lineCoordinates.getY2(point.y).toString()
            + SVG_DELIMITER + LINE
            + this.lineCoordinates.getX1(point.x).toString()
            + SVG_DELIMITER
            + this.lineCoordinates.getY1(point.y).toString()
            + SVG_DELIMITER;
    }

    getCollidables(): Collidable[] {
        let hitbox: Collidable[];
        const setOfPoints = new SetOfPoints(this.points, this.sizeOfLine);
        hitbox = setOfPoints.getCollidables();
        return hitbox;
    }

    getBoundary(): Boundary {
        const boundary = BoundaryBox.create(this.points);
        const ADDITIONAL_EXPANSION = this.sizeOfLine / 2;
        boundary.topLeft.x -= ADDITIONAL_EXPANSION;
        boundary.topLeft.y -= ADDITIONAL_EXPANSION;
        boundary.bottomRight.x += ADDITIONAL_EXPANSION;
        boundary.bottomRight.y += ADDITIONAL_EXPANSION;
        return boundary;
    }

}

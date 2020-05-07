import { SvgType } from '../../../enums/svg';
import { Point } from '../../../interfaces/point';
import { Boundary } from '../../collisions/base-collision/boundary';
import { Collidable } from '../../collisions/base-collision/collidable';
import { SetOfPoints } from '../../collisions/points/set-of-points';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import { SvgProperties } from '../base-svg/svg-properties';
import { SvgUtils } from '../utils/svg-utils';

const NO_POINTS = '';
const DEFAULT_THICKNESS = 10;

export class SvgPencilProperties extends SvgProperties {
  protected points: Point[];
  protected rawPath: string;
  protected previousRawPath: string;
  protected displayThickness: number;
  private thickness: number;

  constructor(svgType: SvgType = SvgType.SvgPencilComponent) {
    super(svgType);

    this.points = [];
    this.rawPath = NO_POINTS;
    this.previousRawPath = NO_POINTS;
    this.displayThickness = DEFAULT_THICKNESS;
    this.thickness = DEFAULT_THICKNESS;
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
    this.setThickness(
      SvgUtils.scalePointsWithThickness(this.thickness, this.points, percentage, direction)
    );
    this.refreshRawPath();
  }

  addPoint(x: number, y: number): void {
    this.points.push({x, y});
    this.appendPreviousRawPath();
    this.refreshLastPointRawPath();
  }

  changeLastPoint(x: number, y: number): void {
    if (this.points.length > 0 ) {
      const LAST_INDEX = this.points.length - 1;
      this.points[LAST_INDEX].x = x;
      this.points[LAST_INDEX].y = y;
      this.refreshLastPointRawPath();
    }
  }

  setThickness(thickness: number): void {
    if (thickness > 0 ) {
      this.thickness = thickness;
    }
    const MINIMUM_THICKNESS = 1;
    this.displayThickness = Math.max(this.thickness, MINIMUM_THICKNESS);
  }
  getThickness(): number { return this.thickness; }

  protected appendPreviousRawPath(): void {
    const LENGTH_FOR_FIRST_INSERTION = 2;
    if (this.points.length === LENGTH_FOR_FIRST_INSERTION) {
      const FIRST_POINT = 0;
      this.previousRawPath = this.firstPointString(this.points[FIRST_POINT]);
    } else if (this.points.length > LENGTH_FOR_FIRST_INSERTION) {
      const PREVIOUS_POINT = this.points.length - LENGTH_FOR_FIRST_INSERTION;
      this.previousRawPath += this.pointString(this.points[PREVIOUS_POINT]);
    }
  }

  protected refreshLastPointRawPath(): void {
    let newPath = this.previousRawPath;

    const AT_LEAST_ONE_POINT = 0;
    const LAST_POINT = this.points.length - 1;
    if (LAST_POINT >= AT_LEAST_ONE_POINT && LAST_POINT < this.points.length) {
      const IS_FIRST_POINT = this.points.length === 1;
      if (IS_FIRST_POINT) {
        newPath += this.firstPointString(this.points[LAST_POINT]);
      } else {
        newPath += this.pointString(this.points[LAST_POINT]);
      }
    }

    this.rawPath = newPath;
  }

  protected refreshRawPath(): void {
    let newRawPath = '';
    for (const point of this.points) {
      if (newRawPath === '') {
        newRawPath += this.firstPointString(point);
      } else {
        newRawPath += this.pointString(point);
      }
    }
    this.rawPath = newRawPath;
    this.previousRawPath = '';
  }

  protected pointString(point: Point): string {
    const LINE = 'L';
    const SVG_DELIMITER = ' ';
    return LINE
        + point.x.toString()
        + SVG_DELIMITER
        + point.y.toString()
        + SVG_DELIMITER;
  }

  protected firstPointString(point: Point): string {
    const FIRST_COMMAND = 'M';
    const SVG_DELIMITER = ' ';
    return FIRST_COMMAND
        + point.x.toString()
        + SVG_DELIMITER
        + point.y.toString()
        + SVG_DELIMITER;
  }

  getCollidables(): Collidable[] {
    let hitbox: Collidable[];
    const setOfPoints = new SetOfPoints(this.points, this.thickness);
    hitbox = setOfPoints.getCollidables();
    return hitbox;
  }

  getBoundary(): Boundary {
    const boundary = BoundaryBox.create(this.points);
    const ADDITIONAL_EXPANSION = this.thickness / 2;
    boundary.topLeft.x -= ADDITIONAL_EXPANSION;
    boundary.topLeft.y -= ADDITIONAL_EXPANSION;
    boundary.bottomRight.x += ADDITIONAL_EXPANSION;
    boundary.bottomRight.y += ADDITIONAL_EXPANSION;
    return boundary;
  }
}

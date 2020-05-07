import { SvgType } from '../../../enums/svg';
import { Point } from '../../../interfaces/point';
import { Coords } from '../../../services/tool-manager/tools/coords';
import { Boundary } from '../../collisions/base-collision/boundary';
import { Collidable } from '../../collisions/base-collision/collidable';
import { CircleCollidable } from '../../collisions/circle/circle-collidable';
import { SetOfPoints } from '../../collisions/points/set-of-points';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import { SvgProperties } from '../base-svg/svg-properties';
import { SvgUtils } from '../utils/svg-utils';

const NO_POINTS = '';
const DEFAULT_THICKNESS = 10;
const NO_JUNCTION = 0;

export class SvgPolylineProperties extends SvgProperties {
  protected points: Coords[];
  protected rawSvgPoints: string;
  protected thickness: number;
  protected displayThickness: number;
  protected junctionRadius: number;

  constructor() {
    super(SvgType.SvgPolylineComponent);

    this.points = [];
    this.rawSvgPoints = NO_POINTS;
    this.thickness = DEFAULT_THICKNESS;
    this.displayThickness = DEFAULT_THICKNESS;
    this.junctionRadius = NO_JUNCTION;
  }

  getCenter(): Point {
    return SvgUtils.getCenter(this.points);
  }

  translate(delta: Point): void {
    SvgUtils.translateAll(delta, this.points);
    this.refreshRawSvgPoints();
  }

  rotateClockwise(degrees: number): void {
    SvgUtils.rotateClockWise(degrees, this.getCenter(), this.points);
    this.refreshRawSvgPoints();
  }

  scale(percentage: number, direction: Point): void {
    const previousFactor = Math.max(this.thickness, 2 * this.junctionRadius);
    const newFactor = SvgUtils.scalePointsWithThickness(previousFactor, this.points, percentage, direction);
    this.setThickness(this.thickness * newFactor / previousFactor);
    this.setJunctionRadius(this.junctionRadius * newFactor / previousFactor);

    this.refreshRawSvgPoints();
  }

  addPoint(x: number, y: number): void {
    this.points.push(new Coords(x, y));
    this.refreshRawSvgPoints();
  }

  changeLastPoint(x: number, y: number): void {
    if (this.points.length > 0 ) {
      const lastIndex = this.points.length - 1;
      this.points[lastIndex].x = x;
      this.points[lastIndex].y = y;
      this.refreshRawSvgPoints();
    }
  }

  setThickness(thickness: number): void {
    if (thickness > 0) {
      this.thickness = thickness;
    }
    const MINIMUM_THICKNESS = 1;
    this.displayThickness = Math.max(this.thickness, MINIMUM_THICKNESS);
  }
  getThickness(): number { return this.thickness; }

  setJunctionRadius(radius: number): void {
    if (radius > NO_JUNCTION) {
      this.junctionRadius = radius;
    } else {
      this.junctionRadius = NO_JUNCTION;
    }
  }
  getJunctionRadius(): number { return this.junctionRadius; }

  protected refreshRawSvgPoints(): void {
    let newPoints = NO_POINTS;
    for (const point of this.points) {
      newPoints += this.pointString(point);
    }
    this.rawSvgPoints = newPoints;
  }

  protected pointString(point: Coords): string {
    const SVG_DELIMITER = ' ';
    return point.x.toString()
        + SVG_DELIMITER
        + point.y.toString()
        + SVG_DELIMITER;
  }

  getCollidables(): Collidable[] {
    let hitbox: Collidable[];
    const setOfPoints = new SetOfPoints(this.points, this.thickness);
    hitbox = setOfPoints.getCollidables();

    if (this.junctionRadius > this.thickness) {
      for (const point of this.points) {
        hitbox.push(new CircleCollidable(point, this.junctionRadius));
      }
    }
    return hitbox;
  }

  getBoundary(): Boundary {
    const boundary = BoundaryBox.create(this.points);
    const additionalExpansion = Math.max(this.thickness / 2, this.junctionRadius);
    boundary.topLeft.x -= additionalExpansion;
    boundary.topLeft.y -= additionalExpansion;
    boundary.bottomRight.x += additionalExpansion;
    boundary.bottomRight.y += additionalExpansion;
    return boundary;
  }
}

import { SvgType } from '../../../enums/svg';
import {Point} from '../../../interfaces/point';
import { Coords } from '../../../services/tool-manager/tools/coords';
import {Boundary} from '../../collisions/base-collision/boundary';
import {Collidable} from '../../collisions/base-collision/collidable';
import {CircleCollidable} from '../../collisions/circle/circle-collidable';
import {BoundaryBox} from '../../collisions/utils/boundary-box';
import { SvgProperties } from '../base-svg/svg-properties';
import {SvgUtils} from '../utils/svg-utils';

const NO_POINTS = '';

export class SvgAerosolProperties extends SvgProperties {
  protected points: Coords[];
  protected centerPoints: Coords[];
  protected centerRadius: number;
  protected rawSvgPoints: string;
  protected primaryColor: string;

  constructor() {
    super(SvgType.SvgAerosolComponent);
    this.points = [];
    this.centerPoints = [];
    this.rawSvgPoints = NO_POINTS;
  }

  getCenter(): Point {
    return SvgUtils.getCenter(this.centerPoints);
  }

  translate(delta: Point): void {
    super.translate(delta);
    SvgUtils.translateAll(delta, this.points);
    SvgUtils.translateAll(delta, this.centerPoints);
    this.refreshRawSvgPoints();
  }

  rotateClockwise(degrees: number): void {
    const center = this.getCenter();
    SvgUtils.rotateClockWise(degrees, center, this.points);
    SvgUtils.rotateClockWise(degrees, center, this.centerPoints);
    this.refreshRawSvgPoints();
  }

  scale(percentage: number, direction: Point): void {
    const center = this.getCenter();
    SvgUtils.scalePoints(this.points, center, percentage, direction);
    SvgUtils.scalePoints(this.centerPoints, center, percentage, direction);
    this.centerRadius *= Math.abs(percentage);
    this.refreshRawSvgPoints();
  }

  setPoints(points: Coords[]): void {
    this.points = points;
    this.refreshRawSvgPoints();
  }

  setHitBox(centerPoints: Coords[], centerRadius: number): void {
    this.centerPoints = centerPoints;
    this.centerRadius = centerRadius;
  }

  addPoint(x: number, y: number): void {
    this.points.push(new Coords(x, y));
    this.refreshRawSvgPoints();
  }

  protected refreshRawSvgPoints(): void {
    let newPoints = NO_POINTS;
    for (const point of this.points) {
      newPoints += this.pointString(point);
    }
    this.rawSvgPoints = newPoints;
  }

  protected pointString(point: Coords): string {
    const SVG_START = 'M';
    const SVG_POINT = ' l1 1 ';
    const SVG_DELIMITER = ' ';
    return SVG_START
      + point.x.toString()
      + SVG_DELIMITER
      + point.y.toString()
      + SVG_POINT;
  }

  getCollidables(): Collidable[] {
    const collidables = [];

    for (const centerPoint of this.centerPoints) {
      collidables.push(new CircleCollidable(centerPoint, this.centerRadius));
    }

    return collidables;
  }

  getBoundary(): Boundary {
    return BoundaryBox.create(this.points);
  }
}

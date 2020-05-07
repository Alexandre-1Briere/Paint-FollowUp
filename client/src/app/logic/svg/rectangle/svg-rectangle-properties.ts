import { Point } from 'src/app/interfaces/point';
import { SvgType } from '../../../enums/svg';
import {Coords} from '../../../services/tool-manager/tools/coords';
import {Boundary} from '../../collisions/base-collision/boundary';
import {Collidable} from '../../collisions/base-collision/collidable';
import {PolygonCollidable} from '../../collisions/polygon/polygon-collidable';
import {BoundaryBox} from '../../collisions/utils/boundary-box';
import {SvgProperties} from '../base-svg/svg-properties';
import {SvgUtils} from '../utils/svg-utils';

const DEFAULT_SIZE = 100;
const DEFAULT_OUTLINE_THICKNESS = 5;
const DEFAULT_SHOULD_DISPLAY = true;

const TOP_LEFT = 0;
const TOP_RIGHT = 1;
const BOTTOM_RIGHT = 2;
const BOTTOM_LEFT = 3;

enum BorderPointsLocation {
  Middle,
  Inner,
}

export class SvgRectangleProperties extends SvgProperties {
  private points: Coords[];
  protected rawSvgPoints: string;
  protected displayOutlineThickness: number;
  private targetOutlineThickness: number;
  displayFill: boolean;
  displayOutline: boolean;

  constructor() {
    super(SvgType.SvgRectangleComponent);

    this.points = [{x: 0, y: 0}, {x: DEFAULT_SIZE, y: 0}, {x: DEFAULT_SIZE, y: DEFAULT_SIZE}, {x: 0, y: DEFAULT_SIZE}];
    this.rawSvgPoints = '';
    this.targetOutlineThickness = DEFAULT_OUTLINE_THICKNESS;
    this.displayOutlineThickness = DEFAULT_OUTLINE_THICKNESS;
    this.displayFill = DEFAULT_SHOULD_DISPLAY;
    this.displayOutline = DEFAULT_SHOULD_DISPLAY;
  }

  centerAt(center: Point): void {
    const previousCenter = this.getCenter();
    const delta = {x: center.x - previousCenter.x, y: center.y - previousCenter.y};
    super.translate(delta);
    SvgUtils.translateAll(delta, this.points);
    this.refreshRawSvgPoints();
  }

  getCenter(): Point {
    return SvgUtils.getCenter(this.points);
  }

  translate(delta: Point): void {
    super.translate(delta);
    SvgUtils.translateAll(delta, this.points);
    this.refreshRawSvgPoints();
  }

  rotateClockwise(degrees: number): void {
    SvgUtils.rotateClockWise(degrees, this.getCenter(), this.points);
    this.refreshRawSvgPoints();
  }

  scale(percentage: number, direction: Point): void {
    SvgUtils.scalePoints(this.points, this.getCenter(), percentage, direction);
    this.adjustDisplayOutlineThickness();
    this.refreshRawSvgPoints();
  }

  get width(): number {
    const DX = this.points[TOP_LEFT].x - this.points[TOP_RIGHT].x;
    const DY = this.points[TOP_LEFT].y - this.points[TOP_RIGHT].y;
    return Math.sqrt(DX * DX + DY * DY);
  }

  get height(): number {
    const DX = this.points[TOP_RIGHT].x - this.points[BOTTOM_RIGHT].x;
    const DY = this.points[TOP_RIGHT].y - this.points[BOTTOM_RIGHT].y;
    return Math.sqrt(DX * DX + DY * DY);
  }

  fitExactlyInside(x1: number, y1: number, x2: number, y2: number): void {
    this.x = Math.min(x1, x2);
    this.y = Math.min(y1, y2);
    x2 = Math.max(x1, x2);
    y2 = Math.max(y1, y2);

    this.points[TOP_LEFT] = {x: this.x, y: this.y};
    this.points[TOP_RIGHT] = {x: x2, y: this.y};
    this.points[BOTTOM_RIGHT] = {x: x2, y: y2};
    this.points[BOTTOM_LEFT] = {x: this.x, y: y2};
    this.refreshRawSvgPoints();
  }

  private refreshRawSvgPoints(): void {
    this.adjustDisplayOutlineThickness();
    let newPoints = '';
    for (const point of this.borderPoints(BorderPointsLocation.Middle)) {
      newPoints += this.pointString(point);
    }
    this.rawSvgPoints = newPoints;
  }

  private pointString(point: Coords): string {
    const SVG_DELIMITER = ' ';
    return point.x.toString()
      + SVG_DELIMITER
      + point.y.toString()
      + SVG_DELIMITER;
  }

  private borderPoints(pointsLocation: BorderPointsLocation): Coords[] {
    const borderPoints: Coords[] = [];

    let shrinkAmount = this.displayOutlineThickness;
    if (pointsLocation === BorderPointsLocation.Middle) {
      shrinkAmount /= 2;
    }

    const shrinkWidth = this.width !== 0 ? shrinkAmount / this.width : 0;
    const shrinkHeight = this.height !== 0 ? shrinkAmount / this.height : 0;

    for (let index = 0; index < this.points.length; index++) {
      const index1 = index < this.points.length - 1 ? index + 1 : 0;
      const index2 = index > 0 ? index - 1 : this.points.length - 1;
      let adjacentPointWidth = this.points[index1];
      let adjacentPointHeight = this.points[index2];
      if (index % 2 === 1) {
        adjacentPointWidth = this.points[index2];
        adjacentPointHeight = this.points[index1];
      }
      borderPoints.push({
        x: this.points[index].x + (adjacentPointWidth.x - this.points[index].x) * shrinkWidth
                                + (adjacentPointHeight.x - this.points[index].x) * shrinkHeight,
        y: this.points[index].y + (adjacentPointWidth.y - this.points[index].y) * shrinkWidth
                                + (adjacentPointHeight.y - this.points[index].y) * shrinkHeight,
      });
    }
    return borderPoints;
  }

  setOutlineThickness(thickness: number): void {
    const MINIMUM_THICKNESS = 0;
    if (thickness >= MINIMUM_THICKNESS) {
      this.targetOutlineThickness = thickness;
      this.refreshRawSvgPoints();
    }
  }
  getOutlineThickness(): number {return this.targetOutlineThickness; }

  private adjustDisplayOutlineThickness(): void {
    const outlineThicknessLimit = Math.min(this.width / 2, this.height / 2);
    this.displayOutlineThickness = Math.min(this.targetOutlineThickness, outlineThicknessLimit);
  }

  getCollidables(): Collidable[] {
    return [
      new PolygonCollidable(this.points),
    ];
  }

  getNegativeCollidables(): Collidable[] {
    const negativeCollidable = [];

    if (!this.displayFill) {
      negativeCollidable.push(
        new PolygonCollidable(this.borderPoints(BorderPointsLocation.Inner)),
      );
    }

    return negativeCollidable;
  }

  getBoundary(): Boundary {
    return BoundaryBox.create(this.points);
  }

  getSelection(): PolygonCollidable {
    return new PolygonCollidable(this.points);
  }

}

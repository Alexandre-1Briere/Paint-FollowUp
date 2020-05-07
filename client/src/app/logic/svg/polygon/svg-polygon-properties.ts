import { SvgType } from '../../../enums/svg';
import {Point} from '../../../interfaces/point';
import { Coords } from '../../../services/tool-manager/tools/coords';
import { Boundary } from '../../collisions/base-collision/boundary';
import { Collidable } from '../../collisions/base-collision/collidable';
import { PolygonCollidable } from '../../collisions/polygon/polygon-collidable';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import { SvgProperties } from '../base-svg/svg-properties';
import { SvgUtils } from '../utils/svg-utils';

const DEFAULT_OUTLINE_THICKNESS = 5;
const DEFAULT_SHOULD_DISPLAY = true;

enum BorderPointsLocation {
  Middle,
  Inner,
}

export class SvgPolygonProperties extends SvgProperties {
  private points: Coords[];
  protected rawSvgPoints: string;
  protected displayOutlineThickness: number;
  private targetOutlineThickness: number;
  displayFill: boolean;
  displayOutline: boolean;

  constructor() {
    super(SvgType.SvgPolygonComponent);
    this.points = [];
    this.targetOutlineThickness = DEFAULT_OUTLINE_THICKNESS;
    this.displayOutlineThickness = DEFAULT_OUTLINE_THICKNESS;
    this.displayFill = DEFAULT_SHOULD_DISPLAY;
    this.displayOutline = DEFAULT_SHOULD_DISPLAY;
    this.rawSvgPoints = '';
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
    return this.findMaxX(this.points) - this.findMinX(this.points);
  }

  get height(): number {
    return this.findMaxY(this.points) - this.findMinY(this.points);
  }

  createRegularPolygonFromMouse(nbOfSides: number, origin: Coords, cursor: Coords): void {
    const newPoints = this.unitPolygonPoints(nbOfSides, cursor.y < origin.y);
    const scale = this.findRegularPolygonScale(newPoints, origin, cursor);
    for (const point of newPoints) {
      point.x *= scale;
      point.y *= scale;
    }
    this.alignPointsOnOrigin(newPoints, origin, cursor);
    this.points = newPoints;

    this.refreshRawSvgPoints();
  }

  private refreshRawSvgPoints(): void {
    this.adjustDisplayOutlineThickness();
    let newPoints = '';
    for (const point of this.polygonBorderPoints(BorderPointsLocation.Middle)) {
      newPoints += this.pointString(point);
    }
    this.rawSvgPoints = newPoints;
  }

  private unitPolygonPoints(nbOfSides: number, inverted: boolean): Coords[] {
    const unitsPoints = [];
    const angleStep = 2 * Math.PI / nbOfSides;
    let angle = inverted ? Math.PI : 0;
    for (let index = 0; index < nbOfSides; index++, angle += angleStep) {
      const x = Math.sin(angle);
      const y = -Math.cos(angle);
      unitsPoints.push(new Coords(x, y));
    }
    return unitsPoints;
  }

  private polygonBorderPoints(pointsLocation: BorderPointsLocation): Coords[] {
    const borderPoints: Coords[] = [];
    if (!this.isAPolygon(this.points)) {
      return borderPoints;
    }

    const center = this.getCenter();
    let shrinkAmount = this.displayOutlineThickness;
    if (pointsLocation === BorderPointsLocation.Middle) {
      shrinkAmount /= 2;
    }

    const referenceX = (this.points[0].x + this.points[1].x) / 2;
    const referenceY = (this.points[0].y + this.points[1].y) / 2;
    const dx = center.x - referenceX;
    const dy = center.y - referenceY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const shrinkRatio = distance !== 0 ? shrinkAmount / distance : 0;

    for (const point of this.points) {
      borderPoints.push({
        x: point.x + (center.x - point.x) * shrinkRatio,
        y: point.y + (center.y - point.y) * shrinkRatio,
      });
    }
    return borderPoints;
  }

  private findRegularPolygonScale(points: Coords[], origin: Coords, cursor: Coords): number {
    let scale = 0;
    if (!this.isAPolygon(points)) {
      return scale;
    }

    const minX = this.findMinX(points);
    const maxX = this.findMaxX(points);
    const minY = this.findMinY(points);
    const maxY = this.findMaxY(points);

    const currentWidth = maxX - minX;
    const targetWidth = Math.abs(cursor.x - origin.x);
    const currentHeight = maxY - minY;
    const targetHeight = Math.abs(cursor.y - origin.y);

    if (currentWidth !== 0) {
      scale = targetWidth / currentWidth;
    }
    if (currentHeight !== 0) {
      scale = Math.max(targetHeight / currentHeight, scale);
    }
    return scale;
  }

  private alignPointsOnOrigin(points: Coords[], origin: Coords, cursor: Coords): void {
    let translateX = origin.x;
    if (cursor.x < origin.x) {
      translateX -= this.findMaxX(points);
    } else {
      translateX -= this.findMinX(points);
    }
    const translateY = origin.y - points[0].y;

    SvgUtils.translateAll({x: translateX, y: translateY}, points);
  }

  private isAPolygon(points: Coords[]): boolean {
    const MIN_SIDES_FOR_POLYGON = 3;
    return points.length >= MIN_SIDES_FOR_POLYGON;
  }

  private findMinX(points: Coords[]): number {
    if (points.length === 0) {
      return 0;
    }
    let minX = points[0].x;
    for (let index = 1; index < points.length; ++index) {
      minX = Math.min(minX, points[index].x);
    }
    return minX;
  }

  private findMaxX(points: Coords[]): number {
    if (points.length === 0) {
      return 0;
    }
    let maxX = points[0].x;
    for (let index = 1; index < points.length; ++index) {
      maxX = Math.max(maxX, points[index].x);
    }
    return maxX;
  }

  private findMinY(points: Coords[]): number {
    if (points.length === 0) {
      return 0;
    }
    let minY = points[0].y;
    for (let index = 1; index < points.length; ++index) {
      minY = Math.min(minY, points[index].y);
    }
    return minY;
  }

  private findMaxY(points: Coords[]): number {
    if (points.length === 0) {
      return 0;
    }
    let maxY = points[0].y;
    for (let index = 1; index < points.length; ++index) {
      maxY = Math.max(maxY, points[index].y);
    }
    return maxY;
  }

  private pointString(point: Coords): string {
    const SVG_DELIMITER = ' ';
    return point.x.toString()
        + SVG_DELIMITER
        + point.y.toString()
        + SVG_DELIMITER;
  }

  setOutlineThickness(thickness: number): void {
    const MINIMUM_THICKNESS = 0;
    if (thickness >= MINIMUM_THICKNESS) {
      this.targetOutlineThickness = thickness;
      this.adjustDisplayOutlineThickness();
      this.refreshRawSvgPoints();
    }
  }

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
        new PolygonCollidable(this.polygonBorderPoints(BorderPointsLocation.Inner)),
      );
    }

    return negativeCollidable;
  }

  getBoundary(): Boundary {
    return BoundaryBox.create(this.points);
  }
}

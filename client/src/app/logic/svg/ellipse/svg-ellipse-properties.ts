import { SvgType } from '../../../enums/svg';
import {Point} from '../../../interfaces/point';
import { Boundary } from '../../collisions/base-collision/boundary';
import { Collidable } from '../../collisions/base-collision/collidable';
import { EllipseCollidable } from '../../collisions/ellipse/ellipse-collidable';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import { SvgProperties } from '../base-svg/svg-properties';
import {SvgUtils} from '../utils/svg-utils';

const DEFAULT_SIZE = 100;
const DEFAULT_OUTLINE_THICKNESS = 5;
const DEFAULT_SHOULD_DISPLAY = true;

export class SvgEllipseProperties extends SvgProperties {
  protected width: number;
  protected height: number;
  protected targetOutlineThickness: number;
  protected displayOutlineThickness: number;
  private angle: number;
  displayFill: boolean;
  displayOutline: boolean;

  constructor() {
    super(SvgType.SvgEllipseComponent);

    this.width = DEFAULT_SIZE;
    this.height = DEFAULT_SIZE;
    this.targetOutlineThickness = DEFAULT_OUTLINE_THICKNESS;
    this.displayOutlineThickness = DEFAULT_OUTLINE_THICKNESS;
    this.angle = 0;
    this.displayFill = DEFAULT_SHOULD_DISPLAY;
    this.displayOutline = DEFAULT_SHOULD_DISPLAY;
  }

  centerUsing(x: number, y: number, radius: number): void {
    this.height = 2 * radius;
    this.width = 2 * radius;
    this.x = x - this.width / 2;
    this.y = y - this.height / 2;
    this.adjustDisplayOutlineThickness();
  }

  centerAt(center: Point): void {
    this.x = center.x - this.width / 2;
    this.y = center.y - this.height / 2;
  }
  getCenter(): Point {
    return {x: this.x + this.width / 2, y: this.y + this.height / 2};
  }

  rotateClockwise(degrees: number): void {
    this.angle += degrees;
  }

  scale(percentage: number, direction: Point): void {
    const farthestPoint = {x: 0, y: 0};
    const closestPoint = {x: 0, y: 0};
    this.getClosestAndFarthestPoints(closestPoint, farthestPoint, percentage, direction);

    const center = this.getCenter();
    this.width = 2 * Math.sqrt(farthestPoint.x * farthestPoint.x + farthestPoint.y * farthestPoint.y);
    this.height = 2 * Math.sqrt(closestPoint.x * closestPoint.x + closestPoint.y * closestPoint.y);
    this.x = center.x - this.width / 2;
    this.y = center.y - this.height / 2;

    let newAngle = Math.PI / 2;
    if (farthestPoint.x !== 0) {
      newAngle = Math.atan(farthestPoint.y / farthestPoint.x);
    }
    this.angle = SvgUtils.radiansToDegrees(newAngle);
  }

  private getClosestAndFarthestPoints(closestPoint: Point, farthestPoint: Point, percentage: number, direction: Point): void {
    let searchAngleClosest = Math.PI / 2;
    let searchAngleFurthest = Math.PI / 2;

    let narrowedAngle = Math.PI / 2;
    const enoughPoints = 5;
    let pointsClosest = this.getPointsFromPerimeter(enoughPoints, searchAngleClosest - narrowedAngle, searchAngleClosest + narrowedAngle);
    SvgUtils.scalePoints(pointsClosest, {x: 0, y: 0}, percentage, direction);
    let pointsFarthest = pointsClosest;

    const TRIES = 5;
    for (let search = 0; search < TRIES; ++search) {
      const indexClosest = this.findClosestPointIndex(pointsClosest);
      const indexFurthest = this.findFarthestPointIndex(pointsFarthest);
      searchAngleClosest += -narrowedAngle + 2 * narrowedAngle * indexClosest / enoughPoints;
      searchAngleFurthest += -narrowedAngle + 2 * narrowedAngle * indexFurthest / enoughPoints;
      narrowedAngle /= enoughPoints;

      pointsClosest = this.getPointsFromPerimeter(enoughPoints, searchAngleClosest - narrowedAngle, searchAngleClosest + narrowedAngle);
      SvgUtils.scalePoints(pointsClosest, {x: 0, y: 0}, percentage, direction);
      pointsFarthest = this.getPointsFromPerimeter(enoughPoints, searchAngleFurthest - narrowedAngle, searchAngleFurthest + narrowedAngle);
      SvgUtils.scalePoints(pointsFarthest, {x: 0, y: 0}, percentage, direction);
    }

    const closest = pointsClosest[this.findClosestPointIndex(pointsClosest)];
    const farthest = pointsFarthest[this.findFarthestPointIndex(pointsFarthest)];
    closestPoint.x = closest.x;
    closestPoint.y = closest.y;
    farthestPoint.x = farthest.x;
    farthestPoint.y = farthest.y;
  }

  private getPointsFromPerimeter(howMany: number, startAngle: number, endAngle: number): Point[] {
    const points = [];
    const angleBetweenPoints = (endAngle - startAngle) / howMany;
    let angle = startAngle;
    for (let index = 0; index <= howMany; ++index) {
      points.push({
        x: (this.width * Math.cos(angle)) / 2,
        y: (this.height * Math.sin(angle)) / 2,
      });
      angle += angleBetweenPoints;
    }
    SvgUtils.rotateClockWise(this.angle, {x: 0, y: 0}, points);
    return points;
  }

  private findFarthestPointIndex(points: Point[]): number {
    let point = points[0];
    let chosenIndex = 0;
    for (let index = 1; index < points.length; ++index) {
      if (point.x * point.x + point.y * point.y < points[index].x * points[index].x + points[index].y * points[index].y) {
        point = points[index];
        chosenIndex = index;
      }
    }
    return chosenIndex;
  }

  private findClosestPointIndex(points: Point[]): number {
    let point = points[0];
    let chosenIndex = 0;
    for (let index = 1; index < points.length; ++index) {
      if (point.x * point.x + point.y * point.y > points[index].x * points[index].x + points[index].y * points[index].y) {
        point = points[index];
        chosenIndex = index;
      }
    }
    return chosenIndex;
  }

  fitExactlyInside(x1: number, y1: number, x2: number, y2: number): void {
    this.x = Math.min(x1, x2);
    this.y = Math.min(y1, y2);

    this.width = Math.max(x1, x2) - this.x;
    this.height = Math.max(y1, y2) - this.y;
    this.adjustDisplayOutlineThickness();
  }

  setOutlineThickness(thickness: number): void {
    const MINIMUM_THICKNESS = 0;
    if (thickness >= MINIMUM_THICKNESS) {
      this.targetOutlineThickness = thickness;
      this.adjustDisplayOutlineThickness();
    }
  }
  getOutlineThickness(): number {return this.targetOutlineThickness; }

  protected adjustDisplayOutlineThickness(): void {
    const outlineThicknessLimit = Math.min(this.width / 2, this.height / 2);
    this.displayOutlineThickness = Math.min(this.targetOutlineThickness, outlineThicknessLimit);
  }

  getCollidables(): Collidable[] {
    return [
      new EllipseCollidable(
        this.getCenter(),
        this.width / 2,
        this.height / 2,
        SvgUtils.degreesToRadians(this.angle)
      ),
    ];
  }

  getNegativeCollidables(): Collidable[] {
    const negativeCollidable = [];

    if (!this.displayFill) {
      const SHRINK = this.displayOutlineThickness;
      negativeCollidable.push(new EllipseCollidable(
        this.getCenter(),
        this.width / 2 - SHRINK,
        this.height / 2 - SHRINK,
        SvgUtils.degreesToRadians(this.angle)
      ));
    }

    return negativeCollidable;
  }

  getBoundary(): Boundary {
    const collidable = this.getCollidables()[0];
    const horizontalProjection = collidable.getLinearProjection({x: 1, y: 0});
    const verticalProjection = collidable.getLinearProjection({x: 0, y: 1});

    return BoundaryBox.create([
      {x: horizontalProjection.start, y: verticalProjection.start},
      {x: horizontalProjection.end, y: verticalProjection.end},
    ]);
  }
}

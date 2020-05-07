import { SvgType } from '../../../enums/svg';
import {Point} from '../../../interfaces/point';
import {SelectionScale} from '../../../interfaces/selection-scale';
import {Coords} from '../../../services/tool-manager/tools/coords';
import { Boundary } from '../../collisions/base-collision/boundary';
import { Collidable } from '../../collisions/base-collision/collidable';
import { PolygonCollidable } from '../../collisions/polygon/polygon-collidable';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import {Projection} from '../../collisions/utils/projection';
import {SvgBasicProperties} from '../base-svg/svg-basic-properties';
import { SvgProperties } from '../base-svg/svg-properties';
import {SvgUtils} from '../utils/svg-utils';

const DEFAULT_SIZE = 100;
const CONTROL_SQUARE_SIZE = 10;

const TOP_LEFT = 0;
const TOP_RIGHT = 1;
const BOTTOM_RIGHT = 2;
const BOTTOM_LEFT = 3;

enum ControlPoint {
  None = -1,
  Top = 0,
  Right = 1,
  Bottom = 2,
  Left = 3,
}

export class SvgSelectionProperties extends SvgProperties {
  protected points: Coords[];
  protected rawSvgPoints: string;
  protected readonly controlSquareSize: number;
  displayControlPoints: boolean;
  controlPoint: ControlPoint;

  constructor() {
    super(SvgType.SvgSelectionComponent);

    this.points = [{x: 0, y: 0}, {x: DEFAULT_SIZE, y: 0}, {x: DEFAULT_SIZE, y: DEFAULT_SIZE}, {x: 0, y: DEFAULT_SIZE}];
    this.rawSvgPoints = '';
    this.controlSquareSize = CONTROL_SQUARE_SIZE;
    this.displayControlPoints = false;
    this.controlPoint = ControlPoint.None;
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

  fitAroundComponentsWithoutChangingAngle(components: SvgBasicProperties[]): void {
    if (components.length === 0) { return; }

    const widthDx = this.points[TOP_RIGHT].x - this.points[TOP_LEFT].x;
    const widthDy = this.points[TOP_RIGHT].y - this.points[TOP_LEFT].y;
    const heightDx = this.points[BOTTOM_RIGHT].x - this.points[TOP_RIGHT].x;
    const heightDy = this.points[BOTTOM_RIGHT].y - this.points[TOP_RIGHT].y;
    const width = Math.sqrt(widthDx * widthDx + widthDy * widthDy);
    const height = Math.sqrt(heightDx * heightDx + heightDy * heightDy);

    const normalizedAxisWidth = {
      x: widthDx / width,
      y: widthDy / width,
    };
    const normalizedAxisHeight = {
      x: heightDx / height,
      y: heightDy / height,
    };

    const projectionsWidth = [];
    const projectionsHeight = [];
    for (const component of components) {
      for (const collidable of component.getCollidables()) {
        projectionsWidth.push(collidable.getLinearProjection(normalizedAxisWidth));
        projectionsHeight.push(collidable.getLinearProjection(normalizedAxisHeight));
      }
    }

    const projectionWidth = Projection.getLinearProjectionContaining(projectionsWidth);
    const projectionHeight = Projection.getLinearProjectionContaining(projectionsHeight);

    const projectionSelectionWidth = Projection.getPointProjection(this.points[TOP_LEFT], normalizedAxisWidth);
    const projectionSelectionHeight = Projection.getPointProjection(this.points[TOP_LEFT], normalizedAxisHeight);

    this.points[TOP_LEFT].x += (projectionWidth.start - projectionSelectionWidth) * normalizedAxisWidth.x +
                               (projectionHeight.start - projectionSelectionHeight) * normalizedAxisHeight.x;
    this.points[TOP_LEFT].y += (projectionWidth.start - projectionSelectionWidth) * normalizedAxisWidth.y +
                               (projectionHeight.start - projectionSelectionHeight) * normalizedAxisHeight.y;
    this.points[TOP_RIGHT].x = this.points[TOP_LEFT].x +
                               (projectionWidth.end - projectionWidth.start) * normalizedAxisWidth.x;
    this.points[TOP_RIGHT].y = this.points[TOP_LEFT].y +
                               (projectionWidth.end - projectionWidth.start) * normalizedAxisWidth.y;
    this.points[BOTTOM_RIGHT].x = this.points[TOP_LEFT].x +
                               (projectionWidth.end - projectionWidth.start) * normalizedAxisWidth.x +
                               (projectionHeight.end - projectionHeight.start) * normalizedAxisHeight.x;
    this.points[BOTTOM_RIGHT].y = this.points[TOP_LEFT].y +
                               (projectionWidth.end - projectionWidth.start) * normalizedAxisWidth.y +
                               (projectionHeight.end - projectionHeight.start) * normalizedAxisHeight.y;
    this.points[BOTTOM_LEFT].x = this.points[TOP_LEFT].x +
                               (projectionHeight.end - projectionHeight.start) * normalizedAxisHeight.x;
    this.points[BOTTOM_LEFT].y = this.points[TOP_LEFT].y +
                               (projectionHeight.end - projectionHeight.start) * normalizedAxisHeight.y;
    this.refreshRawSvgPoints();
  }

  tryToMoveControlPoint(cursor: Point): SelectionScale {
    if (this.controlPoint === ControlPoint.None) {
      return {
        success: false,
        fixedPoint: {x: 0, y: 0},
        grabbedPoint: {x: 0, y: 0},
        movedGrabbedPoint: {x: 0, y: 0}
      };
    }

    let firstIndex = this.controlPoint as number + 2;
    let secondIndex = firstIndex + 1;
    if (firstIndex >= this.points.length) { firstIndex -= this.points.length; }
    if (secondIndex >= this.points.length) { secondIndex -= this.points.length; }
    const fixedControlPoint = {
      x: (this.points[firstIndex].x + this.points[secondIndex].x) / 2,
      y: (this.points[firstIndex].y + this.points[secondIndex].y) / 2,
    };

    firstIndex = this.controlPoint as number;
    secondIndex = this.controlPoint < this.points.length - 1 ? this.controlPoint + 1 : 0;
    const grabbedControlPoint = {
      x: (this.points[firstIndex].x + this.points[secondIndex].x) / 2,
      y: (this.points[firstIndex].y + this.points[secondIndex].y) / 2,
    };

    const scaleAxis = Projection.getParallelAxis(fixedControlPoint, grabbedControlPoint);
    const selectionProjection = Projection.getLinearProjection([grabbedControlPoint, fixedControlPoint], scaleAxis);
    const cursorProjection = Projection.getPointProjection(cursor, scaleAxis);
    const MINIMUM_DISTANCE = 1;
    if (selectionProjection.end - selectionProjection.start === 0 ||
        Math.abs(cursorProjection - selectionProjection.start) <= MINIMUM_DISTANCE) {
      return {
        success: false,
        fixedPoint: {x: 0, y: 0},
        grabbedPoint: {x: 0, y: 0},
        movedGrabbedPoint: {x: 0, y: 0}
      };
    }
    const scale = (cursorProjection - selectionProjection.start) / (selectionProjection.end - selectionProjection.start);

    this.points[firstIndex].x -= scaleAxis.x * (1 - scale);
    this.points[firstIndex].y -= scaleAxis.y * (1 - scale);
    this.points[secondIndex].x -= scaleAxis.x * (1 - scale);
    this.points[secondIndex].y -= scaleAxis.y * (1 - scale);
    this.refreshRawSvgPoints();

    return {
      success: true,
      fixedPoint: fixedControlPoint,
      grabbedPoint: grabbedControlPoint,
      movedGrabbedPoint: {
        x: fixedControlPoint.x + scaleAxis.x * scale,
        y: fixedControlPoint.y + scaleAxis.y * scale,
      }
    };
  }

  releaseGrab(): void {
    this.controlPoint = ControlPoint.None;
  }

  tryToGrabControlPoint(cursor: Point): boolean {
    if (this.displayControlPoints) {
      for (let index = 0; index < this.points.length; ++index) {
        const secondIndex = index < this.points.length - 1 ? index + 1 : 0;
        const controlPointCenter = {
          x: (this.points[index].x + this.points[secondIndex].x) / 2,
          y: (this.points[index].y + this.points[secondIndex].y) / 2,
        };
        if (Math.abs(cursor.x - controlPointCenter.x) <= this.controlSquareSize / 2 &&
          Math.abs(cursor.y - controlPointCenter.y) <= this.controlSquareSize / 2) {
          this.controlPoint = index as ControlPoint;
          return true;
        }
      }
    }

    this.controlPoint = ControlPoint.None;
    return false;
  }

  private refreshRawSvgPoints(): void {
    let newPoints = '';
    for (const point of this.points) {
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

  getCollidables(): Collidable[] {
    return [
      this.getHitbox(),
    ];
  }

  getBoundary(): Boundary {
    return BoundaryBox.create(this.points);
  }

  getHitbox(): PolygonCollidable {
    return new PolygonCollidable(this.points);
  }
}

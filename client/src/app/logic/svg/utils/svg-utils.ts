import { Point } from '../../../interfaces/point';
import {Projection} from '../../collisions/utils/projection';

export class SvgUtils {
  static isHexColorValid(hexColor: string): boolean {
    const hexColorRegex = /^#[0-9a-fA-F]{6}$/i;
    return hexColorRegex.test(hexColor);
  }

  static translateAll(delta: Point, points: Point[]): void {
    for (const point of points) {
      point.x += delta.x;
      point.y += delta.y;
    }
  }

  static rotateClockWise(degrees: number, origin: Point, points: Point[]): void {
    const COS = Math.cos(SvgUtils.degreesToRadians(degrees));
    const SIN = Math.sin(SvgUtils.degreesToRadians(degrees));
    for (const point of points) {
      const DX = point.x - origin.x;
      const DY = point.y - origin.y;
      point.x = DX * COS - DY * SIN + origin.x;
      point.y = DX * SIN + DY * COS + origin.y;
    }
  }

  static scalePoints(points: Point[], reference: Point, percentage: number, direction: Point): void {
    const referenceProjection = Projection.getPointProjection(reference, direction);
    for (const point of points) {
      const projectionLength = referenceProjection - Projection.getPointProjection(point, direction);
      point.x += (1 - percentage) * projectionLength * direction.x;
      point.y += (1 - percentage) * projectionLength * direction.y;
    }
  }

  static scalePointsWithThickness(thickness: number, points: Point[], percentage: number, direction: Point): number {
    const perpendicular = {x: -direction.y, y: direction.x};
    const parallelProjection = Projection.getLinearProjection(points, direction);
    const perpendicularProjection = Projection.getLinearProjection(points, perpendicular);
    const parallelLength = thickness + parallelProjection.end - parallelProjection.start;
    const perpendicularLength = thickness + perpendicularProjection.end - perpendicularProjection.start;

    const newParallelLength = Math.abs(percentage * parallelLength);
    let newThickness = thickness;
    newThickness *= 1 + (newParallelLength - parallelLength) / parallelLength;
    const maxThickness = parallelLength < perpendicularLength ? thickness * perpendicularLength / parallelLength : thickness;
    newThickness = Math.min(newThickness, maxThickness);
    const minThickness = newParallelLength < perpendicularLength ? thickness * newParallelLength / perpendicularLength : thickness;
    newThickness = Math.max(newThickness, minThickness);
    const oldPercentage = percentage;
    if (percentage < 0) {
      percentage = -(newParallelLength - newThickness) / (parallelLength - thickness);
    } else {
      percentage = (newParallelLength - newThickness) / (parallelLength - thickness);
    }

    const center = SvgUtils.getCenter(points);

    const centerProjectionParallel = Projection.getPointProjection(center, direction);
    const offsetParallel = (
      oldPercentage * (thickness + centerProjectionParallel - parallelProjection.start) -
      (newThickness + percentage * (centerProjectionParallel - parallelProjection.start))) / 2 - (
        oldPercentage * (thickness + parallelProjection.end - centerProjectionParallel) -
        (newThickness + percentage * (parallelProjection.end - centerProjectionParallel))
      ) / 2;
    SvgUtils.scalePoints(points, center, percentage, direction);
    SvgUtils.translateAll({x: -offsetParallel * direction.x, y: -offsetParallel * direction.y}, points);

    const centerProjection = Projection.getPointProjection(center, perpendicular);
    const offsetCenterPerpendicular = (centerProjection - perpendicularProjection.start) -
      (perpendicularProjection.end - perpendicularProjection.start) / 2;
    const perpendicularCenter = {
      x: center.x - offsetCenterPerpendicular * perpendicular.x,
      y: center.y - offsetCenterPerpendicular * perpendicular.y,
    };
    const perpendicularAdjustment = 1 + (thickness - newThickness) / (perpendicularLength - thickness);
    SvgUtils.scalePoints(points, perpendicularCenter, perpendicularAdjustment, perpendicular);

    return newThickness;
  }

  static getCenter(points: Point[]): Point {
    if (points.length === 0) {
      return {x: 0, y: 0};
    }

    let sumX = 0;
    let sumY = 0;
    for (const point of points) {
      sumX += point.x;
      sumY += point.y;
    }
    return {x: sumX / points.length, y: sumY / points.length};
  }

  static degreesToRadians(degrees: number): number {
    const HALF_TURN_DEGREES = 180;
    return degrees * Math.PI / HALF_TURN_DEGREES;
  }

  static radiansToDegrees(degrees: number): number {
    const HALF_TURN_DEGREES = 180;
    return degrees * HALF_TURN_DEGREES / Math.PI;
  }
}

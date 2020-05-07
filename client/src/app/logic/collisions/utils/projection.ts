import {Point} from '../../../interfaces/point';
import {LinearProjection} from '../base-collision/linear-projection';

export class Projection {
  static getLinearProjection(points: Point[], axis: Point): LinearProjection {
    if (points.length === 0) {
      const UNDEFINED_PROJECTION = -1000000;
      return {start: UNDEFINED_PROJECTION, end: UNDEFINED_PROJECTION};
    }

    let currentProjection = Projection.getPointProjection(points[0], axis);
    const projection = {start: currentProjection, end: currentProjection};
    for (let index = 1; index < points.length; ++index) {
      currentProjection = Projection.getPointProjection(points[index], axis);
      projection.start = Math.min(projection.start, currentProjection);
      projection.end = Math.max(projection.end, currentProjection);
    }
    return projection;
  }

  static getLinearProjectionContaining(projections: LinearProjection[]): LinearProjection {
    if (projections.length === 0) {
      return {start: 0, end: 0};
    }

    const projection = {start: projections[0].start, end: projections[0].end};
    for (let index = 1; index < projections.length; ++index) {
      projection.start = Math.min(projection.start, projections[index].start);
      projection.end = Math.max(projection.end, projections[index].end);
    }
    return projection;
  }

  static overlapping(projection1: LinearProjection, projection2: LinearProjection): boolean {
    if (projection2.start < projection1.start) {
      const swap = projection1;
      projection1 = projection2;
      projection2 = swap;
    }

    return projection1.end >= projection2.start;
  }

  static isInside(projection1: LinearProjection, projection2: LinearProjection): boolean {
    return projection2.start <= projection1.start &&
           projection1.end <= projection2.end;
  }

  static getPointProjection(point: Point, axis: Point): number {
    return point.x * axis.x + point.y * axis.y;
  }

  static getProjectionOffset(offset: number, axis: Point): number {
    return offset * Math.sqrt(axis.x * axis.x + axis.y * axis.y);
  }

  static getScaleFromPoints(reference: Point, previousLocation: Point, newLocation: Point): number {
    const scaleAxis = Projection.getParallelAxis(reference, previousLocation);
    const projection = this.getLinearProjection([reference, previousLocation], scaleAxis);
    if (projection.start === projection.end) {
      return 0;
    }

    const offset = this.getPointProjection(newLocation, scaleAxis) - projection.start;
    return offset / (projection.end - projection.start);
  }

  static getParallelAxis(point1: Point, point2: Point): Point {
    return {
      x: point2.x - point1.x,
      y: point2.y - point1.y,
    };
  }

  static getNormalAxis(point1: Point, point2: Point): Point {
    return {
      x: point1.y - point2.y,
      y: point2.x - point1.x,
    };
  }
}

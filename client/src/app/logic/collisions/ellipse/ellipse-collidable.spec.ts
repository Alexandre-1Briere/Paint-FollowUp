import {BoundaryBox} from '../utils/boundary-box';
import { EllipseCollidable } from './ellipse-collidable';

const ORIGIN = {x: 0, y: 0};
const DEFAULT_RADIUS = 2;

describe('EllipseCollidable', () => {
  it('should create an instance', () => {
    expect(new EllipseCollidable(ORIGIN, DEFAULT_RADIUS, DEFAULT_RADIUS, 0)).toBeTruthy();
  });

  it('#getNormals returns at least 2 normals for accuracy', () => {
    const ellipse = new EllipseCollidable(ORIGIN, DEFAULT_RADIUS, DEFAULT_RADIUS, 0);
    const BOUNDARY = BoundaryBox.create([ORIGIN]);
    expect(ellipse.getNormals(BOUNDARY).length).toBeGreaterThanOrEqual(2);
  });

  it('#getLinearProjection() is working as expected horizontally', () => {
    const RADIUS_X = 2;
    const RADIUS_Y = 3;
    const ellipse = new EllipseCollidable(ORIGIN, RADIUS_X, RADIUS_Y, 0);
    const HORIZONTAL_AXIS = {x: 1, y: 0};
    const linearProjection = ellipse.getLinearProjection(HORIZONTAL_AXIS);
    expect(linearProjection.start).toBe(-RADIUS_X);
    expect(linearProjection.end).toBe(RADIUS_X);
  });

  it('#getLinearProjection() is working as expected vertically', () => {
    const RADIUS_X = 2;
    const RADIUS_Y = 3;
    const ellipse = new EllipseCollidable(ORIGIN, RADIUS_X, RADIUS_Y, 0);
    const VERTICAL_AXIS = {x: 0, y: 1};
    const linearProjection = ellipse.getLinearProjection(VERTICAL_AXIS);
    expect(linearProjection.start).toBe(-RADIUS_Y);
    expect(linearProjection.end).toBe(RADIUS_Y);
  });

  it('#getLinearProjection() is working as expected with angle, horizontally', () => {
    const RADIUS_X = 10;
    const RADIUS_Y = 2;
    const DEMI_QUARTER_TURN = Math.PI / (2 + 2);
    const ellipse = new EllipseCollidable(ORIGIN, RADIUS_X, RADIUS_Y, DEMI_QUARTER_TURN);
    const HORIZONTAL_AXIS = {x: 1, y: 0};
    const linearProjection = ellipse.getLinearProjection(HORIZONTAL_AXIS);

    const EXPECTED_ELLIPSE_PROJECTION = 7.21110255;
    expect(linearProjection.start).toBeCloseTo(-EXPECTED_ELLIPSE_PROJECTION);
    expect(linearProjection.end).toBeCloseTo(EXPECTED_ELLIPSE_PROJECTION);

    const parallelProjection = ellipse.getLinearProjection({x: Math.cos(DEMI_QUARTER_TURN), y: Math.cos(DEMI_QUARTER_TURN)});
    expect(parallelProjection.end).toBeCloseTo(RADIUS_X);
  });

  it('#getLinearProjection() is working as expected with angle, vertically', () => {
    const RADIUS_X = 10;
    const RADIUS_Y = 2;
    const DEMI_QUARTER_TURN = Math.PI / (2 + 2);
    const ellipse = new EllipseCollidable(ORIGIN, RADIUS_X, RADIUS_Y, DEMI_QUARTER_TURN);
    const VERTICAL_AXIS = {x: 0, y: 1};
    const linearProjection = ellipse.getLinearProjection(VERTICAL_AXIS);

    const EXPECTED_ELLIPSE_PROJECTION = 7.21110255;
    expect(linearProjection.start).toBeCloseTo(-EXPECTED_ELLIPSE_PROJECTION);
    expect(linearProjection.end).toBeCloseTo(EXPECTED_ELLIPSE_PROJECTION);

    const perpendicularProjection = ellipse.getLinearProjection({x: -Math.cos(DEMI_QUARTER_TURN), y: Math.cos(DEMI_QUARTER_TURN)});
    expect(perpendicularProjection.end).toBeCloseTo(RADIUS_Y);
  });
});

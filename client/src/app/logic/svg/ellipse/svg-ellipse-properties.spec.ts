import { Collidable } from '../../collisions/base-collision/collidable';
import { EllipseCollidable } from '../../collisions/ellipse/ellipse-collidable';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import { SvgEllipseProperties } from './svg-ellipse-properties';

class SvgEllipseTestable extends SvgEllipseProperties {
  constructor() {super(); }

  getX(): number {return this.x; }
  getY(): number {return this.y; }
  getWidth(): number {return this.width; }
  getHeight(): number {return this.height; }
  setWidth( width: number): void { this.width = width; }
  setHeight( height: number): void { this.height = height; }
  setTargetOutlineThickness(thickness: number): void { this.targetOutlineThickness = thickness;  }
  getDisplayOutlineThickness(): number {return this.displayOutlineThickness; }
  testAdjustDisplayOutlineThickness(): void {return this.adjustDisplayOutlineThickness(); }
}

// tslint:disable:no-any
// Reason: allow spyOn<any>
describe('SvgEllipseProperties', () => {
  let svgEllipseProperties: SvgEllipseTestable;

  beforeEach(() => {
    svgEllipseProperties = new SvgEllipseTestable();
  });

  it('should create an instance', () => {
    expect(new SvgEllipseProperties()).toBeTruthy();
  });

  it('#centerAt() works as expected', () => {
    const CENTER = {x: 40, y: 50};
    svgEllipseProperties.centerAt(CENTER);
    expect(svgEllipseProperties.getCenter()).toEqual(CENTER);
  });

  it('#rotateClockWise() works as expected', () => {
    const WIDTH = 100;
    const HEIGHT = 10;
    svgEllipseProperties.fitExactlyInside(-WIDTH / 2, - HEIGHT / 2, WIDTH / 2, HEIGHT / 2);
    const QUARTER_TURN = 90;
    svgEllipseProperties.rotateClockwise(QUARTER_TURN);
    const boundary = svgEllipseProperties.getBoundary();
    expect({x: Math.round(boundary.topLeft.x), y: boundary.topLeft.y}).toEqual({x: -HEIGHT / 2, y: -WIDTH / 2});
    expect({x: Math.round(boundary.bottomRight.x), y: boundary.bottomRight.y}).toEqual({x: HEIGHT / 2, y: WIDTH / 2});
  });

  it('#scale() works as expected vertically', () => {
    const WIDTH = 100;
    const HEIGHT = 50;
    svgEllipseProperties.fitExactlyInside(-WIDTH / 2, - HEIGHT / 2, WIDTH / 2, HEIGHT / 2);
    svgEllipseProperties.scale(2, {x: 0, y: 1});
    const boundary = svgEllipseProperties.getBoundary();
    expect({x: Math.round(boundary.topLeft.x), y: Math.round(boundary.topLeft.y)}).toEqual({x: -WIDTH / 2, y: -HEIGHT});
    expect({x: Math.round(boundary.bottomRight.x), y: Math.round(boundary.bottomRight.y)}).toEqual({x: WIDTH / 2, y: HEIGHT});
  });

  it('#scale() works as expected horizontally', () => {
    const WIDTH = 50;
    const HEIGHT = 100;
    svgEllipseProperties.fitExactlyInside(-WIDTH / 2, - HEIGHT / 2, WIDTH / 2, HEIGHT / 2);
    svgEllipseProperties.scale(-1 / 2, {x: 1, y: 0});
    const boundary = svgEllipseProperties.getBoundary();
    expect({x: Math.round(boundary.topLeft.x), y: Math.round(boundary.topLeft.y)}).toEqual({x: -13, y: -HEIGHT / 2});
    expect({x: Math.round(boundary.bottomRight.x), y: Math.round(boundary.bottomRight.y)}).toEqual({x: 13, y: HEIGHT / 2});
  });

  it('#scale() does not divide by 0', () => {
    svgEllipseProperties.fitExactlyInside(-1, -1, 1, 1);
    svgEllipseProperties.scale(0, {x: -1, y: 0});
    const boundary = svgEllipseProperties.getBoundary();
    const closeToZero = 1000;
    expect({x: Math.abs(Math.round(boundary.topLeft.x * closeToZero)), y: boundary.topLeft.y}).toEqual({x: 0, y: -1});
    expect({x: Math.abs(Math.round(boundary.bottomRight.x * closeToZero)), y: boundary.bottomRight.y}).toEqual({x: 0, y: 1});
  });

  it('#scale() works when ellipse is rotated', () => {
    const WIDTH = 10;
    const HEIGHT = 100;
    svgEllipseProperties.fitExactlyInside(-WIDTH / 2, - HEIGHT / 2, WIDTH / 2, HEIGHT / 2);
    const ANGLE = 15;
    svgEllipseProperties.rotateClockwise(ANGLE);
    svgEllipseProperties.scale(2 / HEIGHT, {x: 1, y: 0});
    const boundary = svgEllipseProperties.getBoundary();
    const PRECISIONS = 100;
    expect({
      x: Math.round(boundary.topLeft.x * PRECISIONS) / PRECISIONS,
      y: Math.round(boundary.topLeft.y)}).toEqual({x: -0.28, y: -48
    });
    expect({
      x: Math.round(boundary.bottomRight.x * PRECISIONS) / PRECISIONS,
      y: Math.round(boundary.bottomRight.y)}).toEqual({x: 0.28, y: 48
    });

    const ellipseNewAngle = 'angle';
    const EXPECTED_NEW_ANGLE = -89.7;
    expect(svgEllipseProperties[ellipseNewAngle]).toBeCloseTo(EXPECTED_NEW_ANGLE);
  });

  it('#setOutlineThickness() works as expected with normal input', () => {
    const THICKNESS = 10;
    svgEllipseProperties.setOutlineThickness(THICKNESS);
    expect(svgEllipseProperties.getOutlineThickness()).toEqual(THICKNESS);
  });

  it('#setOutlineThickness() does nothing with negative input', () => {
    const correctThickness = svgEllipseProperties.getOutlineThickness();
    const WRONG_THICKNESS = -5;
    svgEllipseProperties.setOutlineThickness(WRONG_THICKNESS);
    expect(svgEllipseProperties.getOutlineThickness()).toEqual(correctThickness);
  });

  it('#centerUsing() should call adjustDisplayThickness', () => {
    const adjustDisplayOutlineThicknessSpy = spyOn<any>(svgEllipseProperties, 'adjustDisplayOutlineThickness').and.callThrough();
    const X = 3;
    const Y = 4;
    const RADIUS = 7;
    svgEllipseProperties.centerUsing(X, Y, RADIUS);
    expect(adjustDisplayOutlineThicknessSpy).toHaveBeenCalled();
  });

  it ('#getCenter() works as expected', () => {
    const CENTER_X = svgEllipseProperties.getX() + svgEllipseProperties.getWidth() / 2;
    const CENTER_Y = svgEllipseProperties.getY() + svgEllipseProperties.getHeight() / 2;
    expect(svgEllipseProperties.getCenter()).toEqual({x: CENTER_X, y: CENTER_Y});
  });

  it(' #fitExactlyInside should call computeRwlQuadrant and adjustDisplayOutLineThickness', () => {
    const adjustDisplayOutlineThicknessSpy = spyOn<any>(svgEllipseProperties, 'adjustDisplayOutlineThickness');
    const X1 = 1;
    const Y1 = 2;
    const X2 = 1;
    const Y2 = 2;
    svgEllipseProperties.fitExactlyInside(X1, Y1, X2, Y2);
    expect(adjustDisplayOutlineThicknessSpy).toHaveBeenCalled();
  });

  it(' #getOutlineThickness should call computeRwlQuadrant and adjustDisplayOutLineThickness', () => {
    const THICKNESS = 67;
    svgEllipseProperties.setOutlineThickness(THICKNESS);
    expect(svgEllipseProperties.getOutlineThickness()).toEqual(THICKNESS);
  });

  it(' #adjustDisplayOutlineThickness should set targetOutlineThickness with min value', () => {
    const THICKNESS = 120;
    const HEIGHT = 80;
    const WIDTH = 40;
    svgEllipseProperties.setHeight(HEIGHT);
    svgEllipseProperties.setWidth(WIDTH);
    svgEllipseProperties.setTargetOutlineThickness(THICKNESS);
    svgEllipseProperties.testAdjustDisplayOutlineThickness();
    const EXPECTED_VALUE = 20;
    expect(svgEllipseProperties.getDisplayOutlineThickness()).toEqual(EXPECTED_VALUE);
  });
  /*code inspiré de https://stackoverflow.com/questions/38980689/how-to-test-for-model-type-in-angular-2-jasmine*/

  it('#getCollidables should return Collidable[]', () => {
    const items = svgEllipseProperties.getCollidables();
    items.forEach((item) => {
      expect(item instanceof EllipseCollidable).toBe(true,
          'instance of EllipseCollidable');
    });
  });

  it ('#getBoundary should call creat ', () => {
    const getBoundarySpy = spyOn<any>(BoundaryBox, 'create');
    svgEllipseProperties.getBoundary();
    expect(getBoundarySpy).toHaveBeenCalled();
  });

  it ('#getNegativeCollidables should return the negative Collidable array ', () => {
    const negativeCollidable = [];
    svgEllipseProperties.displayFill = false;
    const SHRINK = svgEllipseProperties.getDisplayOutlineThickness();
    negativeCollidable.push(new EllipseCollidable(
        {x:  svgEllipseProperties.getCenter().x, y:  svgEllipseProperties.getCenter().y},
        svgEllipseProperties.getWidth() / 2 - SHRINK,
        svgEllipseProperties.getHeight() / 2 - SHRINK,
        0
    ));

    const EXPECTED_VALUE = svgEllipseProperties.getNegativeCollidables();
    expect(negativeCollidable).toEqual(EXPECTED_VALUE);
  });

  it ('#getNegativeCollidables should return empty array when displayFill is true ', () => {
    const negativeCollidable: Collidable[] = [];
    svgEllipseProperties.displayFill = true;

    const EXPECTED_VALUE = svgEllipseProperties.getNegativeCollidables();
    expect(negativeCollidable).toEqual(EXPECTED_VALUE);
  });

});

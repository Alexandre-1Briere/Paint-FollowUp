import { PolygonCollidable } from '../../collisions/polygon/polygon-collidable';
import { BoundaryBox } from '../../collisions/utils/boundary-box';
import { SvgRectangleProperties } from './svg-rectangle-properties';

describe('SvgRectangleProperties', () => {
  let svgRectangleProperties: SvgRectangleProperties;

  beforeEach(() => {
    svgRectangleProperties = new SvgRectangleProperties();
  });

  it('should create an instance', () => {
    expect(new SvgRectangleProperties()).toBeTruthy();
  });

  it('#centerAt() works as expected', () => {
    const CENTER = {x: 40, y: 50};
    svgRectangleProperties.centerAt(CENTER);
    expect(svgRectangleProperties.getCenter()).toEqual(CENTER);
  });

  it('#rotateClockwise() works as expected', () => {
    const LONG_SIDE = 10;
    svgRectangleProperties.fitExactlyInside(0, -1, LONG_SIDE, 1);
    const QUARTER_TURN = 90;
    svgRectangleProperties.rotateClockwise(QUARTER_TURN);
    const boundary = svgRectangleProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: -1 + LONG_SIDE / 2, y: -LONG_SIDE / 2});
    expect(boundary.bottomRight).toEqual({x: 1 + LONG_SIDE / 2, y: LONG_SIDE / 2});
  });

  it('#scale() works as expected', () => {
    svgRectangleProperties.fitExactlyInside(-1, -1, 1, 1);
    svgRectangleProperties.scale(2, {x: 1, y: 0});
    let boundary = svgRectangleProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: -2, y: -1});
    expect(boundary.bottomRight).toEqual({x: 2, y: 1});

    svgRectangleProperties.scale(-1 / 2, {x: 0, y: 1});
    boundary = svgRectangleProperties.getBoundary();
    expect(boundary.topLeft).toEqual({x: -2, y: -1 / 2});
    expect(boundary.bottomRight).toEqual({x: 2, y: 1 / 2});
  });

  it('#fitExactlyInside() works as expected with normal inputs', () => {
    const X1 = 40;
    const Y1 = 50;
    const X2 = 60;
    const Y2 = 80;
    const CENTER_X = (X2 + X1) / 2;
    const CENTER_Y = (Y2 + Y1) / 2;
    svgRectangleProperties.fitExactlyInside(X1, Y1, X2, Y2);
    expect(svgRectangleProperties.getCenter().x).toEqual(CENTER_X);
    expect(svgRectangleProperties.getCenter().y).toEqual(CENTER_Y);
  });

  it('#fitExactlyInside() works as expected with normal, negative inputs', () => {
    const X1 = 40;
    const Y1 = 50;
    const X2 = -60;
    const Y2 = -80;
    const CENTER_X = (X2 + X1) / 2;
    const CENTER_Y = (Y2 + Y1) / 2;
    svgRectangleProperties.fitExactlyInside(X1, Y1, X2, Y2);
    expect(svgRectangleProperties.getCenter().x).toEqual(CENTER_X);
    expect(svgRectangleProperties.getCenter().y).toEqual(CENTER_Y);
  });

  it('#fitExactlyInside() works as expected when rectangle has no surface area', () => {
    svgRectangleProperties.fitExactlyInside(0, 0, 0, 0);
    expect(svgRectangleProperties.getCenter()).toEqual({x: 0, y: 0});
  });

  it('#setOutlineThickness() works as expected with normal input', () => {
    const THICKNESS = 10;
    svgRectangleProperties.setOutlineThickness(THICKNESS);
    expect(svgRectangleProperties.getOutlineThickness()).toEqual(THICKNESS);
  });

  it('#setOutlineThickness() does nothing with negative input', () => {
    const correctThickness = svgRectangleProperties.getOutlineThickness();
    const WRONG_THICKNESS = -5;
    svgRectangleProperties.setOutlineThickness(WRONG_THICKNESS);
    expect(svgRectangleProperties.getOutlineThickness()).toEqual(correctThickness);
  });

  it ('#getBoundary() should call correct method', () => {
    // tslint:disable-next-line:no-any
    const getBoundarySpy = spyOn<any>(BoundaryBox, 'create');
    svgRectangleProperties.getBoundary();
    expect(getBoundarySpy).toHaveBeenCalled();
  });

  it('#getCollidables() should return Collidable[]', () => {
    const items = svgRectangleProperties.getCollidables();
    items.forEach((item) => {
      expect(item instanceof PolygonCollidable).toBe(true,
          'instance of PolygonCollidable');
    });
  });

  it('#getCollidables() should return Collidable[]', () => {
    const items = svgRectangleProperties.getCollidables();
    items.forEach((item) => {
      expect(item instanceof PolygonCollidable).toBe(true,
          'instance of PolygonCollidable');
    });
  });
});
